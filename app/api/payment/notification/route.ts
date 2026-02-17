import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/payment/notification - Midtrans webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      order_id,
      transaction_status,
      payment_type,
      gross_amount,
      transaction_time,
    } = body

    console.log("Midtrans notification received:", body)

    // Find transaction
    const transaction = await prisma.transaction.findUnique({
      where: { midtransOrderId: order_id },
      include: { order: true },
    })

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      )
    }

    // Update transaction status
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        transactionStatus: transaction_status,
        paymentType: payment_type,
        paidAt: transaction_time ? new Date(transaction_time) : null,
      },
    })

    // Update order status based on payment status
    let orderStatus = "PENDING"
    
    if (transaction_status === "settlement" || transaction_status === "capture") {
      orderStatus = "PROCESSING"
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      orderStatus = "CANCELLED"
    }

    await prisma.order.update({
      where: { id: transaction.orderId },
      data: { status: orderStatus },
    })

    // TODO: Here you would typically:
    // 1. Call your game top-up provider API
    // 2. Update order status to COMPLETED after successful top-up
    // 3. Send notification to user

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing payment notification:", error)
    return NextResponse.json(
      { error: "Failed to process notification" },
      { status: 500 }
    )
  }
}

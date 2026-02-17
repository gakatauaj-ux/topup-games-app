import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { snap } from "@/lib/midtrans"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// POST /api/payment/create - Create Midtrans transaction
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { orderId } = body

    // Get order details
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
        user: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Order is not in pending status" },
        { status: 400 }
      )
    }

    // Check if transaction already exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { orderId },
    })

    if (existingTransaction?.paymentToken) {
      return NextResponse.json({
        token: existingTransaction.paymentToken,
        orderId: order.id,
      })
    }

    // Generate unique order ID for Midtrans
    const midtransOrderId = `ORDER-${order.id}-${Date.now()}`

    // Create Midtrans transaction
    const parameter = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: order.totalAmount,
      },
      customer_details: {
        first_name: order.user.name || "Customer",
        email: order.user.email,
      },
      item_details: order.items.map((item) => ({
        id: item.productVariant.id,
        price: item.price,
        quantity: item.quantity,
        name: `${item.productVariant.product.name} - ${item.productVariant.name}`,
      })),
    }

    const transaction = await snap.createTransaction(parameter)

    // Save transaction to database
    await prisma.transaction.create({
      data: {
        orderId: order.id,
        midtransOrderId,
        grossAmount: order.totalAmount,
        paymentToken: transaction.token,
        transactionStatus: "PENDING",
      },
    })

    return NextResponse.json({
      token: transaction.token,
      orderId: order.id,
      redirect_url: transaction.redirect_url,
    })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    )
  }
}

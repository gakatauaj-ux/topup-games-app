import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/orders - Get user orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("id")

    if (orderId) {
      // Get specific order
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
          transaction: true,
          topupData: true,
        },
      })

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(order)
    }

    // Get all user orders
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
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
        transaction: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
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
    const { 
      items, 
      totalAmount, 
      gameId, 
      serverId, 
      username, 
      nickname, 
      notes 
    } = body

    // Create order with transaction and topup data
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        topupData: {
          create: {
            gameId,
            serverId,
            username,
            nickname,
            notes,
          },
        },
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
        topupData: true,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test database connection
    const categories = await prisma.category.findMany({
      take: 1,
      select: { id: true, name: true }
    })
    
    return NextResponse.json({
      status: "ok",
      message: "Database connected successfully",
      data: categories
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({
      status: "error",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

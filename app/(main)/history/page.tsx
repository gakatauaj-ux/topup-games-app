"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { formatPrice, formatDate } from "@/lib/utils"
import { Loader2, Package, CheckCircle, XCircle, Clock } from "lucide-react"

interface Order {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    price: number
    productVariant: {
      name: string
      product: {
        name: string
      }
    }
  }>
  transaction: {
    transactionStatus: string
  } | null
}

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login?callbackUrl=/history")
      return
    }

    fetchOrders()
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "PROCESSING":
        return <Clock className="w-5 h-5 text-blue-600" />
      default:
        return <Package className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Selesai"
      case "CANCELLED":
        return "Dibatalkan"
      case "PROCESSING":
        return "Diproses"
      case "PENDING":
        return "Menunggu Pembayaran"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Riwayat Transaksi</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Belum ada transaksi
          </h2>
          <p className="text-gray-500 mb-4">
            Kamu belum melakukan transaksi apapun
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID: {order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center">
                    {getStatusIcon(order.status)}
                    <span
                      className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2"
                    >
                      <div>
                        <p className="font-medium">
                          {item.productVariant.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.productVariant.name} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {order.status === "PENDING" && order.transaction?.transactionStatus === "PENDING" && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-yellow-600">
                      Pembayaran belum selesai. Silakan selesaikan pembayaran.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { unstable_noStore } from "next/cache"

export const dynamic = "force-dynamic"

async function getOrders() {
  unstable_noStore()
  return await prisma.order.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      items: {
        include: {
          productVariant: {
            include: {
              product: {
                select: { name: true },
              },
            },
          },
        },
      },
      transaction: true,
      topupData: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kelola Orders</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">Semua Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{order.user.name || "-"}</div>
                    <div className="text-xs text-gray-400">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.topupData?.gameId}
                    {order.topupData?.serverId && (
                      <div className="text-xs text-gray-400">
                        Server: {order.topupData.serverId}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items.map((item) => (
                      <div key={item.id}>
                        {item.productVariant.product.name} - {item.productVariant.name}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.transaction?.paymentType || "-"}
                    <div className="text-xs text-gray-400">
                      {order.transaction?.transactionStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "PROCESSING"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

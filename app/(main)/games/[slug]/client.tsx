"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { Loader2, AlertCircle } from "lucide-react"

interface GameDetailClientProps {
  category: any
}

export default function GameDetailClient({ category }: GameDetailClientProps) {
  const router = useRouter()
  const { data: session } = useSession()
  
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [gameId, setGameId] = useState("")
  const [serverId, setServerId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Get the first product (should be diamonds/UC/etc)
  const product = category.products[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push("/login?callbackUrl=" + encodeURIComponent(window.location.pathname))
      return
    }

    if (!selectedVariant || !gameId) {
      setError("Silakan pilih nominal dan masukkan ID game")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              productVariantId: selectedVariant.id,
              quantity: 1,
              price: selectedVariant.price,
            },
          ],
          totalAmount: selectedVariant.price,
          gameId,
          serverId: serverId || null,
          username: null,
          nickname: null,
          notes: null,
        }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const order = await orderResponse.json()

      // Create payment
      const paymentResponse = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
        }),
      })

      if (!paymentResponse.ok) {
        throw new Error("Failed to create payment")
      }

      const payment = await paymentResponse.json()

      // Redirect to Midtrans payment page
      if (payment.redirect_url) {
        window.location.href = payment.redirect_url
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          <p className="text-blue-100">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Pilih Nominal</h2>
          
          {product ? (
            <div className="grid grid-cols-2 gap-4">
              {product.variants.map((variant: any) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedVariant?.id === variant.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="font-bold text-lg">{variant.name}</div>
                  <div className="text-blue-600 font-bold">
                    {formatPrice(variant.price)}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Tidak ada produk tersedia</p>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Data Game</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Game / User ID *
              </label>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Contoh: 123456789"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Masukkan ID game Anda
              </p>
            </div>

            {(category.slug === "mobile-legends" || category.slug === "free-fire") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Server ID (Opsional)
                </label>
                <input
                  type="text"
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  placeholder="Contoh: 1234"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {selectedVariant && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Pembayaran:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(selectedVariant.price)}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedVariant}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : !session ? (
                "Login untuk Melanjutkan"
              ) : (
                "Bayar Sekarang"
              )}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-500">
            <h3 className="font-bold text-gray-700 mb-2">Cara menemukan ID:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Buka aplikasi game</li>
              <li>Masuk ke profil/profile</li>
              <li>ID game biasanya terlihat di sana</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

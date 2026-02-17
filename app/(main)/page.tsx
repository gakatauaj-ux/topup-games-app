import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Gamepad2, Zap, Shield, Clock } from "lucide-react"

async function getCategories() {
  return await prisma.category.findMany({
    where: { isActive: true },
    include: {
      products: {
        where: { isActive: true },
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  })
}

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Top Up Game Murah & Cepat
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Diamond Mobile Legends, Free Fire, PUBG Mobile, dan Genshin Impact
          </p>
          <Link
            href="#games"
            className="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-full hover:bg-blue-50 transition-colors"
          >
            Mulai Top Up
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Proses Cepat</h3>
            <p className="text-gray-600">Top up otomatis dalam hitungan menit</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Aman Terpercaya</h3>
            <p className="text-gray-600">Transaksi aman dengan payment gateway</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Game Lengkap</h3>
            <p className="text-gray-600">Semua game populer tersedia</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
            <p className="text-gray-600">Siap melayani kapan saja</p>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Pilih Game</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/games/${category.slug}`}
              className="group block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video bg-gray-200 relative">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                    <Gamepad2 className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {category.products.length} produk
                  </span>
                  <span className="text-blue-600 font-medium text-sm">
                    Top Up →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How to Buy Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Cara Beli</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="font-bold mb-2">Pilih Game</h3>
              <p className="text-gray-600 text-sm">Pilih game yang ingin di-top up</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="font-bold mb-2">Masukkan ID</h3>
              <p className="text-gray-600 text-sm">Masukkan ID game dan pilih nominal</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="font-bold mb-2">Pembayaran</h3>
              <p className="text-gray-600 text-sm">Pilih metode pembayaran</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                4
              </div>
              <h3 className="font-bold mb-2">Selesai</h3>
              <p className="text-gray-600 text-sm">Diamond/UC masuk otomatis</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

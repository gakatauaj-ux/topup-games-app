import Navbar from "@/components/navbar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Topup Games</h3>
              <p className="text-gray-400 text-sm">
                Top up diamond dan UC untuk game favoritmu dengan harga murah dan proses cepat.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Menu</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Beranda</li>
                <li>Cara Beli</li>
                <li>Riwayat Transaksi</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Kontak</h3>
              <p className="text-gray-400 text-sm">
                Email: support@topupgames.com<br />
                WhatsApp: 0812-3456-7890
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            © 2024 Topup Games. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}

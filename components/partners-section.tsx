"use client"

export default function PartnersSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Our Partner Brands</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* ECONET Wireless */}
          <div className="flex items-center justify-center p-8 border-2 border-blue-500 rounded-3xl bg-white hover:shadow-lg transition-shadow duration-300">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900 tracking-wider">ECONET</div>
              <div className="text-red-600 text-lg">→</div>
              <div className="text-xs text-gray-600">Wireless</div>
            </div>
          </div>

          {/* EcoSure */}
          <div className="flex items-center justify-center p-8 border-2 border-blue-500 rounded-3xl bg-white hover:shadow-lg transition-shadow duration-300">
            <div className="text-center">
              <span className="text-3xl font-bold text-blue-900">Eco</span>
              <span className="text-3xl font-italic text-red-600">Sure</span>
            </div>
          </div>

          {/* MooVah */}
          <div className="flex items-center justify-center p-8 border-2 border-blue-500 rounded-3xl bg-white hover:shadow-lg transition-shadow duration-300">
            <div className="text-center">
              <div className="text-3xl font-bold">
                <span className="text-red-600">Moo</span>
                <span className="text-blue-900">Vah</span>
              </div>
            </div>
          </div>

          {/* Maisha */}
          <div className="flex items-center justify-center p-8 border-2 border-blue-500 rounded-3xl bg-white hover:shadow-lg transition-shadow duration-300">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">
                Ma<span className="text-green-500">i</span>sha
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

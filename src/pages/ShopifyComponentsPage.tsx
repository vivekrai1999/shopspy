import NavigationBar from '../components/NavigationBar'

export default function ShopifyComponentsPage() {
  const scrollToSection = () => {
    // Placeholder for scroll functionality
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-gray-900 to-gray-900">
      <NavigationBar
        onFeaturesClick={scrollToSection}
        onAboutClick={scrollToSection}
      />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Shopify Components
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Explore and use reusable Shopify store components
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Hotspot Carousel Component */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-500/30 transition-all border border-purple-400/20">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hotspot Carousel</h3>
              <p className="text-white/70 text-sm">
                Interactive carousel with clickable hotspots for showcasing products and features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


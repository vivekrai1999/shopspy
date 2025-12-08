import { Zap, Shield, Download, Filter, Copy, BarChart3, Sparkles } from 'lucide-react'

export default function AboutSection() {
  return (
    <div className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">About ShopSpy</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
            Powerful Shopify Product Analytics
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Explore, analyze, and export product data from any Shopify store with ease. 
            Built for researchers, analysts, and curious minds.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Left: Description */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
            <h3 className="text-2xl font-semibold text-white mb-4">What is ShopSpy?</h3>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                ShopSpy is a powerful, no-code tool that lets you explore and analyze products from any Shopify store. 
                Simply enter a store URL, and we'll fetch all available products instantly.
              </p>
              <p>
                Whether you're conducting market research, analyzing competitors, or just exploring what products a store offers, 
                ShopSpy provides you with comprehensive product data in an easy-to-use interface.
              </p>
              <p>
                All data can be filtered, sorted, copied, and exported to Excel or CSV format for further analysis in your preferred tools.
              </p>
            </div>
          </div>

          {/* Right: Key Features */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
            <h3 className="text-2xl font-semibold text-white mb-6">Why Choose ShopSpy?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg border border-white/5 hover:border-white/10 transition-all">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Lightning Fast</h4>
                  <p className="text-white/70 text-sm">Fetch thousands of products in seconds with our optimized API integration.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg border border-white/5 hover:border-white/10 transition-all">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">No Registration Required</h4>
                  <p className="text-white/70 text-sm">Start using ShopSpy immediately. No sign-ups, no API keys, no hassle.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg border border-white/5 hover:border-white/10 transition-all">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Download className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Export Anywhere</h4>
                  <p className="text-white/70 text-sm">Download your data in Excel or CSV format for use in any tool.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all group">
            <div className="p-3 bg-blue-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
              <Filter className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Advanced Filtering</h4>
            <p className="text-white/60 text-sm">Filter products by any column with real-time search capabilities.</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all group">
            <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
              <Copy className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">One-Click Copy</h4>
            <p className="text-white/60 text-sm">Copy any cell content instantly with a single click.</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all group">
            <div className="p-3 bg-green-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Customizable View</h4>
            <p className="text-white/60 text-sm">Show, hide, and pin columns to create your perfect view.</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all group">
            <div className="p-3 bg-orange-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
              <Download className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Bulk Export</h4>
            <p className="text-white/60 text-sm">Export all products or filtered results in multiple formats.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

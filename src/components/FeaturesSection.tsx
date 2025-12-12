import { Download, Filter, Copy, Pin, Eye, Upload, AlertCircle, FileSpreadsheet, Image, Package, Zap } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <div className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-blue-900 py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Everything you need to explore and analyze Shopify store products
          </p>
        </div>

        {/* Bento Grid - 3x3 Modern Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 max-w-6xl mx-auto">
          {/* Row 1, Col 1: Logo/Brand Card */}
          <div className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 hover:border-purple-400/40 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center group">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Package className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-2xl font-bold text-white">shopspy</h3>
            </div>
          </div>

          {/* Row 1, Col 2: Product Name Filtering */}
          <div className="md:col-span-1 md:row-span-1 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all border border-blue-400/20">
              <Upload className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Product Name Filter</h3>
            <p className="text-white/70 text-sm">
              Upload a text file with product names to filter and find missing products instantly.
            </p>
          </div>

          {/* Row 1, Col 3: Missing Products Detection */}
          <div className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/20 hover:border-yellow-400/40 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-yellow-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-yellow-500/30 transition-all border border-yellow-400/20">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Missing Products</h3>
            <p className="text-white/70 text-sm">
              Automatically detect which products from your list are not found in the store.
            </p>
          </div>

          {/* Row 2, Col 1-2: Custom Export (Large) */}
          <div className="md:col-span-2 md:row-span-1 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-purple-400/20 hover:border-purple-400/40 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-purple-500/30 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all border border-purple-400/20">
                <FileSpreadsheet className="w-8 h-8 text-purple-300" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white mb-1">Custom Export</div>
                <div className="text-purple-300/80 text-sm">Field Mappings</div>
              </div>
            </div>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Create custom CSV/Excel exports with your own field mappings. Map any product data path or use custom literal values.
            </p>
          </div>

          {/* Row 2, Col 3: Advanced Filtering */}
          <div className="md:col-span-1 md:row-span-1 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all border border-blue-400/20">
              <Filter className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Advanced Filtering</h3>
            <p className="text-white/70 text-sm">
              Filter products by any column with real-time search. Find exactly what you're looking for instantly.
            </p>
          </div>

          {/* Row 3, Col 1: Export Options */}
          <div className="md:col-span-1 md:row-span-1 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-green-400/30 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-green-500/30 transition-all border border-green-400/20">
              <Download className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Export Formats</h3>
            <p className="text-white/70 text-sm">
              Export to Excel, CSV, JSON, or Shopify-compatible formats. Perfect for data analysis and sharing.
            </p>
          </div>

          {/* Row 3, Col 2: Image Management */}
          <div className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all border border-blue-400/20">
              <Image className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Image Management</h3>
            <p className="text-white/70 text-sm">
              View, copy, and download all product images. Download entire image sets as ZIP files.
            </p>
          </div>

          {/* Row 3, Col 3: Quick Actions */}
          <div className="md:col-span-1 md:row-span-1 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/30 transition-all border border-purple-400/20">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Quick Actions</h3>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Copy className="w-3 h-3" />
                  <Pin className="w-3 h-3" />
                  <Eye className="w-3 h-3" />
                </div>
              </div>
            </div>
            <p className="text-white/70 text-sm">
              One-click copy, pin columns, and customize visibility. Work faster with powerful shortcuts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


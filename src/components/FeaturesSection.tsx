import { Download, Filter, Copy, Pin, Eye, Settings2, Search } from 'lucide-react'

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

        {/* Bento Grid - Perfect 4x4 Square Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-4 max-w-4xl mx-auto auto-rows-fr">
          {/* Row 1: Medium Feature - Filtering (spans 2 cols, 1 row) */}
          <div className="md:col-span-2 md:row-span-1 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all border border-blue-400/20">
              <Filter className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Advanced Filtering</h3>
            <p className="text-white/70 text-sm">
              Filter products by any column with real-time search. Find exactly what you're looking for instantly.
            </p>
          </div>

          {/* Row 1: Medium Feature - Column Visibility (spans 2 cols, 1 row) */}
          <div className="md:col-span-2 md:row-span-1 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all border border-blue-400/20">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Custom Column Visibility</h3>
            <p className="text-white/70 text-sm">
              Show or hide columns of your choice. Pin important columns for easy reference while scrolling.
            </p>
          </div>

          {/* Row 2-3: Large Feature - Export (spans 2 cols, 2 rows) */}
          <div className="md:col-span-2 md:row-span-2 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all border border-blue-400/20">
              <Download className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Export to Excel & CSV</h3>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Download your product data in Excel or CSV format for further analysis and reporting. Perfect for data analysis and sharing with your team.
            </p>
          </div>

          {/* Row 2-3: Large Feature - Sort & Organize (spans 2 cols, 2 rows) */}
          <div className="md:col-span-2 md:row-span-2 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all border border-blue-400/20">
              <Settings2 className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Sort & Organize</h3>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Sort by any column in ascending or descending order. Organize your data exactly how you need it with powerful sorting capabilities.
            </p>
          </div>

          {/* Row 4: Small Feature - Copy (spans 1 col, 1 row) */}
          <div className="md:col-span-1 md:row-span-1 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all border border-blue-400/20">
              <Copy className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">One-Click Copy</h3>
            <p className="text-white/70 text-sm">
              Copy any cell content directly to your clipboard.
            </p>
          </div>

          {/* Row 4: Small Feature - Pin (spans 1 col, 1 row) */}
          <div className="md:col-span-1 md:row-span-1 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all border border-blue-400/20">
              <Pin className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pin Columns</h3>
            <p className="text-white/70 text-sm">
              Pin important columns for easy reference.
            </p>
          </div>

          {/* Row 4: Medium Feature - Real-time Search (spans 2 cols, 1 row) */}
          <div className="md:col-span-2 md:row-span-1 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all border border-blue-400/20">
              <Search className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Real-time Search</h3>
            <p className="text-white/70 text-sm">
              Search across all columns instantly. Get results as you type with lightning-fast performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


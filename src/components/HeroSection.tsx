import { Sparkles, MapPin, Search, Loader2, CheckCircle2, AlertCircle, ArrowDown } from 'lucide-react'

interface HeroSectionProps {
  baseUrl: string
  onBaseUrlChange: (url: string) => void
  onFetch: () => void
  isLoading: boolean
  error: Error | null
  progress: { page: number; fetchedCount: number }
  products: any[] | null | undefined
  shouldFetch: boolean
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function HeroSection({
  baseUrl,
  onBaseUrlChange,
  onFetch,
  isLoading,
  error,
  progress,
  products,
  shouldFetch,
  onKeyPress,
}: HeroSectionProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-32 overflow-hidden">
      {/* Dark background with blue gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-blue-900"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* AI-powered Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-full">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-medium">Shopify Product Explorer</span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white text-center mb-6 leading-tight">
          Explore Shopify products in{' '}
          <span className="underline decoration-blue-400 decoration-2 underline-offset-4">seconds</span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 text-lg sm:text-xl text-center mb-12 max-w-2xl mx-auto">
          Fetch, analyze, and export all products from any Shopify store. Filter, sort, copy data, and download in Excel or CSV format.
        </p>

        {/* Search Card */}
        <div className="bg-gray-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-white text-lg font-semibold">
              Enter your Shopify store URL to get started
            </h2>
          </div>

          {/* Search Input */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => onBaseUrlChange(e.target.value)}
                onKeyPress={onKeyPress}
                placeholder="Enter store URL"
                className="w-full pl-12 pr-4 py-4 text-base bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder-gray-500"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={onFetch}
              disabled={!baseUrl.trim() || isLoading}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        <div className="mt-6 space-y-3">
          {isLoading && progress.page > 0 && (
            <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">
                      Fetching products...
                    </span>
                    <span className="text-xs font-medium text-blue-200 bg-blue-500/30 px-2.5 py-1 rounded-full">
                      Page {progress.page} • {progress.fetchedCount} products
                    </span>
                  </div>
                  <div className="w-full bg-blue-500/20 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-400 h-2.5 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.min((progress.fetchedCount / (progress.page * 250)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white mb-1">Error</p>
                  <p className="text-sm text-red-200">{error.message}</p>
                </div>
              </div>
            </div>
          )}

          {shouldFetch && products && products.length > 0 && (
            <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    Successfully fetched {products.length.toLocaleString()} product{products.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    Scroll down to view the table
                  </p>
                </div>
                <ArrowDown className="w-5 h-5 text-emerald-400 animate-bounce flex-shrink-0" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Large Logo at Bottom */}
      <div className="absolute -bottom-64 left-0 right-0 h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 flex items-end justify-center pb-16">
          <div className="text-[200px] sm:text-[300px] lg:text-[400px] font-black text-blue-500/10 select-none">
            shopspy
          </div>
        </div>
      </div>
    </div>
  )
}


import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAllProductsWithProgress } from '../api/hooks/useAllProducts'
import type { ColumnDef } from '@tanstack/react-table'
import type { Product } from '../types/product'
import { Toaster } from 'react-hot-toast'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import NavigationBar from '../components/NavigationBar'
import HeroSection from '../components/HeroSection'
import TableSection from '../components/TableSection'
import FeaturesSection from '../components/FeaturesSection'
import AboutSection from '../components/AboutSection'
import ProductModal from '../components/ProductModal'

function HomePage() {
  const [baseUrl, setBaseUrl] = useState('')
  const [shouldFetch, setShouldFetch] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'variants' | 'images' | 'options'>('overview')
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [productNameFilter, setProductNameFilter] = useState<string[]>([])
  const tableSectionRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const { data: products, isLoading, error, progress, refetch } =
    useAllProductsWithProgress({
      baseUrl: baseUrl.trim() || undefined,
      enabled: shouldFetch && !!baseUrl.trim(),
    })

  // Filter products based on uploaded product names
  const filteredProducts = productNameFilter.length > 0
    ? products?.filter(product => 
        productNameFilter.some(filterName => 
          product.title.toLowerCase().trim() === filterName.toLowerCase().trim()
        )
      ) || []
    : products || []

  // Clear row selection when filter changes
  useEffect(() => {
    if (productNameFilter.length > 0) {
      setRowSelection({})
    }
  }, [productNameFilter])

  // Auto-scroll to table when products are loaded after button press
  useEffect(() => {
    if (shouldFetch && products && products.length > 0 && !isLoading && tableSectionRef.current) {
      setTimeout(() => {
        tableSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)
    }
  }, [shouldFetch, products, isLoading])

  const handleFetch = () => {
    if (baseUrl.trim()) {
      setShouldFetch(true)
      refetch()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && baseUrl.trim() && !isLoading) {
      handleFetch()
    }
  }

  const columns: ColumnDef<Product>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer accent-blue-500"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => {
            e.stopPropagation()
            row.toggleSelected(e.target.checked)
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer accent-blue-500"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: 'id',
      header: 'ID',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'title',
      header: 'Product Name',
      size: 300,
      minSize: 200,
      maxSize: 500,
      cell: (info) => {
        return <span className="font-medium">{info.getValue() as string}</span>
      },
    },
    {
      accessorKey: 'handle',
      header: 'Handle',
      size: 350,
      minSize: 200,
      maxSize: 600,
      cell: (info) => info.getValue() || '-',
    },
    {
      accessorKey: 'vendor',
      header: 'Vendor',
      cell: (info) => info.getValue() || '-',
    },
    {
      id: 'body_html',
      header: 'Description',
      accessorFn: (row) => row.body_html || '',
      cell: (info) => {
        const product = info.row.original
        const html = info.getValue() as string
        if (!html) return '-'
        const text = html.replace(/<[^>]*>/g, '').trim()
        const tooltipId = `desc-${product.id}`
        return (
          <div className="max-w-xs">
            <span 
              className="line-clamp-2 text-sm cursor-help" 
              data-tooltip-id={tooltipId}
              data-tooltip-content={text}
            >
              {text || '-'}
            </span>
            <Tooltip id={tooltipId} className="!bg-gray-800 !text-white !border !border-white/10 !rounded-lg !px-3 !py-2 !max-w-md !z-50" />
          </div>
        )
      },
    },
    {
      id: 'price',
      header: 'Price',
      accessorFn: (row) => {
        const firstVariant = row.variants[0]
        return firstVariant ? parseFloat(firstVariant.price) : 0
      },
      cell: (info) => {
        const price = info.getValue() as number
        return `₹${price.toFixed(2)}`
      },
    },
    {
      id: 'compare_at_price',
      header: 'Compare At Price',
      accessorFn: (row) => {
        const firstVariant = row.variants[0]
        return firstVariant && firstVariant.compare_at_price ? parseFloat(firstVariant.compare_at_price) : null
      },
      cell: (info) => {
        const price = info.getValue() as number | null
        return price ? `₹${price.toFixed(2)}` : '-'
      },
    },
    {
      id: 'variants',
      header: 'Variants Count',
      accessorFn: (row) => row.variants.length,
      cell: (info) => info.getValue(),
    },
    {
      id: 'variant_details',
      header: 'Variant Details',
      accessorFn: (row) => {
        if (row.variants.length === 0) return '-'
        return row.variants.length
      },
      cell: (info) => {
        const product = info.row.original
        if (product.variants.length === 0) return '-'
        
        const tooltipId = `variants-${product.id}`
        const fullDetails = product.variants.map((v, index) => {
          const parts = [
            `Variant ${index + 1}: ${v.title}`,
            `Price: ₹${parseFloat(v.price).toFixed(2)}`,
            v.compare_at_price ? `Compare: ₹${parseFloat(v.compare_at_price).toFixed(2)}` : null,
            v.sku ? `SKU: ${v.sku}` : null,
            `Available: ${v.available ? 'Yes' : 'No'}`,
            v.requires_shipping ? 'Requires Shipping' : null,
            v.taxable ? 'Taxable' : null,
            v.grams > 0 ? `Weight: ${v.grams}g` : null,
          ].filter(Boolean).join('\n')
          return parts
        }).join('\n\n')
        
        return (
          <div className="max-w-md">
            <div className="flex flex-col gap-1.5">
              {product.variants.slice(0, 2).map((variant) => (
                <div 
                  key={variant.id}
                  className="flex items-start gap-2 p-2 bg-gray-700/30 rounded-lg border border-white/10"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-white truncate">
                        {variant.title}
                      </span>
                      {!variant.available && (
                        <span className="px-1.5 py-0.5 bg-red-900/30 text-red-400 text-xs rounded flex-shrink-0">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-white/90">
                        ₹{parseFloat(variant.price).toFixed(2)}
                      </span>
                      {variant.compare_at_price && (
                        <span className="text-xs text-white/60 line-through">
                          ₹{parseFloat(variant.compare_at_price).toFixed(2)}
                        </span>
                      )}
                      {variant.sku && (
                        <span className="text-xs text-white/70">
                          SKU: {variant.sku}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {product.variants.length > 2 && (
                <div 
                  className="text-xs text-white/60 cursor-help px-2 py-1"
                  data-tooltip-id={tooltipId}
                  data-tooltip-content={fullDetails}
                >
                  +{product.variants.length - 2} more variant{product.variants.length - 2 !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            {product.variants.length > 2 && (
              <Tooltip id={tooltipId} className="!bg-gray-800 !text-white !border !border-white/10 !rounded-lg !px-3 !py-2 !max-w-lg !z-50 !whitespace-pre-line" />
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'product_type',
      header: 'Type',
      cell: (info) => info.getValue() || '-',
    },
    {
      id: 'variant_sku',
      header: 'SKU',
      accessorFn: (row) => {
        const firstVariant = row.variants[0]
        return firstVariant?.sku || '-'
      },
      cell: (info) => info.getValue() || '-',
    },
    {
      id: 'variant_available',
      header: 'Available',
      accessorFn: (row) => {
        const firstVariant = row.variants[0]
        return firstVariant?.available ?? false
      },
      cell: (info) => {
        const available = info.getValue() as boolean
        return (
          <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${
            available 
              ? 'bg-green-500/20 text-green-300 border-green-400/30' 
              : 'bg-red-500/20 text-red-300 border-red-400/30'
          }`}>
            {available ? 'Yes' : 'No'}
          </span>
        )
      },
    },
    {
      id: 'variant_requires_shipping',
      header: 'Requires Shipping',
      accessorFn: (row) => {
        const firstVariant = row.variants[0]
        return firstVariant?.requires_shipping ?? false
      },
      cell: (info) => {
        const requiresShipping = info.getValue() as boolean
        return requiresShipping ? 'Yes' : 'No'
      },
    },
    {
      id: 'variant_taxable',
      header: 'Taxable',
      accessorFn: (row) => {
        const firstVariant = row.variants[0]
        return firstVariant?.taxable ?? false
      },
      cell: (info) => {
        const taxable = info.getValue() as boolean
        return taxable ? 'Yes' : 'No'
      },
    },
    {
      id: 'variant_grams',
      header: 'Weight (g)',
      accessorFn: (row) => {
        const firstVariant = row.variants[0]
        return firstVariant?.grams || 0
      },
      cell: (info) => {
        const grams = info.getValue() as number
        return grams > 0 ? `${grams}g` : '-'
      },
    },
    {
      id: 'images',
      header: 'Images Count',
      accessorFn: (row) => row.images.length,
      cell: (info) => info.getValue(),
    },
    {
      id: 'image_src',
      header: 'First Image',
      accessorFn: (row) => row.images[0]?.src || '',
      cell: (info) => {
        const product = info.row.original
        const src = info.getValue() as string
        if (!src) return '-'
        const tooltipId = `image-${product.id}`
        const allImages = product.images.map(img => img.src).join('\n')
        return (
          <div className="max-w-xs">
            <a 
              href={src} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs truncate block cursor-help"
              data-tooltip-id={tooltipId}
              data-tooltip-content={product.images.length > 1 ? `All ${product.images.length} images:\n${allImages}` : src}
            >
              View Image{product.images.length > 1 ? ` (${product.images.length})` : ''}
            </a>
            <Tooltip id={tooltipId} className="!bg-gray-800 !text-white !border !border-white/10 !rounded-lg !px-3 !py-2 !max-w-lg !z-50 !whitespace-pre-line" />
          </div>
        )
      },
    },
    {
      id: 'tags',
      header: 'Tags',
      accessorFn: (row) => row.tags.join(', '),
      cell: (info) => {
        const product = info.row.original
        if (product.tags.length === 0) return '-'
        const tooltipId = `tags-${product.id}`
        const allTags = product.tags.join(', ')
        
        // Color palette for tags
        const colors = [
          'bg-blue-500/20 text-blue-300 border-blue-400/30',
          'bg-purple-500/20 text-purple-300 border-purple-400/30',
          'bg-pink-500/20 text-pink-300 border-pink-400/30',
          'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
          'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
          'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
          'bg-amber-500/20 text-amber-300 border-amber-400/30',
          'bg-orange-500/20 text-orange-300 border-orange-400/30',
          'bg-red-500/20 text-red-300 border-red-400/30',
          'bg-violet-500/20 text-violet-300 border-violet-400/30',
        ]
        
        const getTagColor = (tag: string) => {
          const colorIndex = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
          return colors[colorIndex]
        }
        
        return (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`px-2.5 py-1 ${getTagColor(tag)} text-xs font-medium rounded-full border max-w-[120px] truncate inline-block`}
                title={tag}
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span 
                className="text-xs text-white/60 cursor-help px-2.5 py-1"
                data-tooltip-id={tooltipId}
                data-tooltip-content={`All tags:\n${allTags}`}
              >
                +{product.tags.length - 3} more
              </span>
            )}
            {product.tags.length > 3 && (
              <Tooltip id={tooltipId} className="!bg-gray-800 !text-white !border !border-white/10 !rounded-lg !px-3 !py-2 !max-w-lg !z-50 !whitespace-pre-line" />
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'published_at',
      header: 'Published At',
      cell: (info) => {
        const date = info.getValue() as string
        if (!date) return '-'
        return new Date(date).toLocaleDateString()
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: (info) => {
        const date = new Date(info.getValue() as string)
        return date.toLocaleDateString()
      },
    },
    {
      accessorKey: 'updated_at',
      header: 'Updated At',
      cell: (info) => {
        const date = new Date(info.getValue() as string)
        return date.toLocaleDateString()
      },
    },
  ]

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setActiveTab('overview')
  }

  const closeModal = () => {
    setSelectedProduct(null)
  }

  return (
    <div className="min-h-screen">
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#1f2937',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#60a5fa',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      
      <NavigationBar
        onFeaturesClick={() => scrollToSection(featuresRef)}
        onAboutClick={() => scrollToSection(aboutRef)}
      />

      <HeroSection
        baseUrl={baseUrl}
        onBaseUrlChange={(url) => {
          setBaseUrl(url)
          setShouldFetch(false)
        }}
        onFetch={handleFetch}
        isLoading={isLoading}
        error={error}
        progress={progress}
        products={products}
        shouldFetch={shouldFetch}
        onKeyPress={handleKeyPress}
      />

      {shouldFetch && products && products.length > 0 && (
        <div ref={tableSectionRef}>
          <TableSection
            products={filteredProducts}
            allProducts={products}
            columns={columns}
            isLoading={isLoading}
            onProductClick={handleProductClick}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            productNameFilter={productNameFilter}
            onProductNameFilterChange={setProductNameFilter}
          />
        </div>
      )}

      <div ref={featuresRef}>
        <FeaturesSection />
      </div>

      {/* Shopify Components Section */}
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-blue-900 py-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Shopify Components
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Explore and use reusable Shopify store components for your projects
            </p>
            <Link
              to="/shopify-components"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors border border-purple-400/20 text-sm font-medium"
            >
              <span>View All Components</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div ref={aboutRef}>
        <AboutSection />
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={closeModal}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  )
}

export default HomePage

import { useEffect, useState } from 'react'
import { Copy, X, Package, Download, Loader2 } from 'lucide-react'
import type { Product } from '../types/product'
import toast from 'react-hot-toast'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface ProductModalProps {
  product: Product
  onClose: () => void
  activeTab: 'overview' | 'variants' | 'images' | 'options'
  onTabChange: (tab: 'overview' | 'variants' | 'images' | 'options') => void
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!', {
      position: 'bottom-center',
      style: {
        background: '#1f2937',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0.5rem',
        padding: '12px 16px',
      },
      iconTheme: {
        primary: '#60a5fa',
        secondary: '#ffffff',
      },
    })
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

export default function ProductModal({ product, onClose, activeTab, onTabChange }: ProductModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  // Prevent body scroll when modal is open
  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden'
    
    // Cleanup: restore body scroll when modal closes
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const downloadAllImagesAsZip = async () => {
    if (product.images.length === 0) return

    setIsDownloading(true)
    try {
      const zip = new JSZip()
      const imageFolder = zip.folder('images')

      // Fetch all images and add to ZIP
      const imagePromises = product.images.map(async (image, index) => {
        try {
          const response = await fetch(image.src)
          const blob = await response.blob()
          
          // Get file extension from URL or default to jpg
          const urlParts = image.src.split('.')
          const extension = urlParts[urlParts.length - 1].split('?')[0] || 'jpg'
          const fileName = `image-${index + 1}.${extension}`
          
          if (imageFolder) {
            imageFolder.file(fileName, blob)
          }
        } catch (error) {
          console.error(`Failed to fetch image ${index + 1}:`, error)
          toast.error(`Failed to download image ${index + 1}`, {
            position: 'bottom-center',
            style: {
              background: '#1f2937',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem',
              padding: '12px 16px',
            },
          })
        }
      })

      await Promise.all(imagePromises)

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      
      // Download the ZIP file
      const fileName = `${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_images.zip`
      saveAs(zipBlob, fileName)

      toast.success(`Downloaded ${product.images.length} images as ZIP!`, {
        position: 'bottom-center',
        style: {
          background: '#1f2937',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          padding: '12px 16px',
        },
        iconTheme: {
          primary: '#60a5fa',
          secondary: '#ffffff',
        },
      })
    } catch (error) {
      console.error('Failed to create ZIP:', error)
      toast.error('Failed to download images', {
        position: 'bottom-center',
        style: {
          background: '#1f2937',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          padding: '12px 16px',
        },
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-800 rounded-2xl border border-white/10 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{product.title}</h2>
              <p className="text-sm text-white/60">ID: {product.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/80" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-white/10">
          <button
            onClick={() => onTabChange('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-gray-700/50 text-white border-t border-x border-white/10'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Overview
          </button>
          {product.variants.length > 0 && (
            <button
              onClick={() => onTabChange('variants')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'variants'
                  ? 'bg-gray-700/50 text-white border-t border-x border-white/10'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Variants ({product.variants.length})
            </button>
          )}
          {product.images.length > 0 && (
            <button
              onClick={() => onTabChange('images')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'images'
                  ? 'bg-gray-700/50 text-white border-t border-x border-white/10'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Images ({product.images.length})
            </button>
          )}
          {product.options.length > 0 && (
            <button
              onClick={() => onTabChange('options')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'options'
                  ? 'bg-gray-700/50 text-white border-t border-x border-white/10'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Options ({product.options.length})
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1 block">Handle</label>
                  <p 
                    className="text-sm text-white cursor-pointer hover:text-blue-400 transition-colors group/item inline-flex items-center gap-2"
                    onClick={() => copyToClipboard(product.handle)}
                    title="Click to copy"
                  >
                    <span>{product.handle}</span>
                    <Copy className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-blue-400 flex-shrink-0" />
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1 block">Vendor</label>
                  <p 
                    className="text-sm text-white cursor-pointer hover:text-blue-400 transition-colors group/item inline-flex items-center gap-2"
                    onClick={() => copyToClipboard(product.vendor || '')}
                    title="Click to copy"
                  >
                    <span>{product.vendor || '-'}</span>
                    <Copy className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-blue-400 flex-shrink-0" />
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1 block">Type</label>
                  <p 
                    className="text-sm text-white cursor-pointer hover:text-blue-400 transition-colors group/item inline-flex items-center gap-2"
                    onClick={() => copyToClipboard(product.product_type || '')}
                    title="Click to copy"
                  >
                    <span>{product.product_type || '-'}</span>
                    <Copy className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-blue-400 flex-shrink-0" />
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1 block">Variants Count</label>
                  <p className="text-sm text-white">{product.variants.length}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1 block">Images Count</label>
                  <p className="text-sm text-white">{product.images.length}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1 block">Published At</label>
                  <p 
                    className="text-sm text-white cursor-pointer hover:text-blue-400 transition-colors group/item inline-flex items-center gap-2"
                    onClick={() => copyToClipboard(product.published_at)}
                    title="Click to copy"
                  >
                    <span>{product.published_at ? new Date(product.published_at).toLocaleString() : '-'}</span>
                    <Copy className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-blue-400 flex-shrink-0" />
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1 block">Created At</label>
                  <p 
                    className="text-sm text-white cursor-pointer hover:text-blue-400 transition-colors group/item inline-flex items-center gap-2"
                    onClick={() => copyToClipboard(product.created_at)}
                    title="Click to copy"
                  >
                    <span>{new Date(product.created_at).toLocaleString()}</span>
                    <Copy className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-blue-400 flex-shrink-0" />
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1 block">Updated At</label>
                  <p 
                    className="text-sm text-white cursor-pointer hover:text-blue-400 transition-colors group/item inline-flex items-center gap-2"
                    onClick={() => copyToClipboard(product.updated_at)}
                    title="Click to copy"
                  >
                    <span>{new Date(product.updated_at).toLocaleString()}</span>
                    <Copy className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-blue-400 flex-shrink-0" />
                  </p>
                </div>
              </div>
              
              {product.tags.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => {
                      // Generate a color based on tag hash for consistency
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
                      const colorIndex = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
                      const colorClass = colors[colorIndex]
                      
                      return (
                        <span
                          key={tag}
                          className={`px-3 py-1.5 ${colorClass} text-xs font-medium rounded-full border cursor-pointer hover:scale-105 transition-all duration-200 shadow-sm max-w-[150px] truncate inline-block`}
                          onClick={() => copyToClipboard(tag)}
                          title={tag}
                        >
                          {tag}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {product.body_html && (
                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 block">Description</label>
                  <div 
                    className="text-sm text-white/80 bg-gray-700/30 rounded-lg p-4 border border-white/10 cursor-pointer hover:border-blue-400/30 transition-colors"
                    onClick={() => copyToClipboard(product.body_html.replace(/<[^>]*>/g, '').trim())}
                    title="Click to copy"
                  >
                    <div dangerouslySetInnerHTML={{ __html: product.body_html }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'variants' && product.variants.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="bg-gray-700/30 rounded-lg border border-white/10 p-4 overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2 mb-3 min-w-0">
                    <h5 
                      className="text-base font-semibold text-white cursor-pointer hover:text-blue-400 transition-colors group/item flex items-center gap-2 flex-1 min-w-0"
                      onClick={() => copyToClipboard(variant.title)}
                      title={variant.title}
                    >
                      <span className="truncate min-w-0">{variant.title}</span>
                      <Copy className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-blue-400 flex-shrink-0" />
                    </h5>
                    {!variant.available && (
                      <span className="px-2 py-0.5 bg-red-900/30 text-red-400 text-xs rounded flex-shrink-0">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <label className="text-xs text-white/70 mb-1 block">Price</label>
                      <div className="flex items-center gap-2">
                        <p 
                          className="text-white font-medium cursor-pointer hover:text-blue-400 transition-colors group/item inline-flex items-center gap-2"
                          onClick={() => copyToClipboard(`₹${parseFloat(variant.price).toFixed(2)}`)}
                          title="Click to copy"
                        >
                          <span>₹{parseFloat(variant.price).toFixed(2)}</span>
                          <Copy className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-blue-400 flex-shrink-0" />
                        </p>
                        {variant.compare_at_price && (
                          <p 
                            className="text-white/50 line-through text-xs cursor-pointer hover:text-blue-400 inline-flex items-center gap-1"
                            onClick={() => copyToClipboard(`₹${parseFloat(variant.compare_at_price!).toFixed(2)}`)}
                            title="Click to copy"
                          >
                            <span>₹{parseFloat(variant.compare_at_price).toFixed(2)}</span>
                            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-400" />
                          </p>
                        )}
                      </div>
                    </div>
                    {variant.sku && (
                      <div>
                        <label className="text-xs text-white/70 mb-1 block">SKU</label>
                        <p 
                          className="text-white cursor-pointer hover:text-blue-400 transition-colors group/item inline-flex items-center gap-2"
                          onClick={() => copyToClipboard(variant.sku!)}
                          title="Click to copy"
                        >
                          <span>{variant.sku}</span>
                          <Copy className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-blue-400 flex-shrink-0" />
                        </p>
                      </div>
                    )}
                    {variant.grams > 0 && (
                      <div>
                        <label className="text-xs text-white/70 mb-1 block">Weight</label>
                        <p 
                          className="text-white cursor-pointer hover:text-blue-400 transition-colors group/item inline-flex items-center gap-2"
                          onClick={() => copyToClipboard(`${variant.grams}g`)}
                          title="Click to copy"
                        >
                          <span>{variant.grams}g</span>
                          <Copy className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-blue-400 flex-shrink-0" />
                        </p>
                      </div>
                    )}
                    {(variant.option1 || variant.option2 || variant.option3) && (
                      <div>
                        <label className="text-xs text-white/70 mb-2 block">Options</label>
                        <div className="flex flex-wrap gap-2">
                          {variant.option1 && (
                            <span 
                              className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded cursor-pointer hover:bg-blue-500/30 transition-colors"
                              onClick={() => copyToClipboard(variant.option1!)}
                              title="Click to copy"
                            >
                              {variant.option1}
                            </span>
                          )}
                          {variant.option2 && (
                            <span 
                              className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded cursor-pointer hover:bg-blue-500/30 transition-colors"
                              onClick={() => copyToClipboard(variant.option2!)}
                              title="Click to copy"
                            >
                              {variant.option2}
                            </span>
                          )}
                          {variant.option3 && (
                            <span 
                              className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded cursor-pointer hover:bg-blue-500/30 transition-colors"
                              onClick={() => copyToClipboard(variant.option3!)}
                              title="Click to copy"
                            >
                              {variant.option3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'images' && product.images.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">
                  {product.images.length} Image{product.images.length !== 1 ? 's' : ''}
                </h3>
                <button
                  onClick={downloadAllImagesAsZip}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-blue-400/20"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download All as ZIP</span>
                    </>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.images.map((image) => {
                // Generate low quality image URL by adding width parameter
                const getLowQualityUrl = (url: string) => {
                  if (url.includes('?')) {
                    return `${url}&width=246`
                  }
                  return `${url}?width=246`
                }
                const lowQualitySrc = getLowQualityUrl(image.src)
                
                return (
                  <div
                    key={image.id}
                    className="bg-gray-700/30 rounded-lg border border-white/10 overflow-hidden group"
                  >
                    <div className="aspect-square bg-gray-800/50 relative">
                      <img
                        src={lowQualitySrc}
                        alt={`Product image ${image.id}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <a
                          href={image.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-medium transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Full
                        </a>
                      </div>
                    </div>
                    <div className="p-2">
                      <p 
                        className="text-xs text-white/70 truncate cursor-pointer hover:text-blue-400 transition-colors group/item inline-flex items-center gap-2"
                        onClick={() => copyToClipboard(image.src)}
                        title="Click to copy URL"
                      >
                        <span>{image.width} × {image.height}</span>
                        <Copy className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-blue-400 flex-shrink-0" />
                      </p>
                    </div>
                  </div>
                )
              })}
              </div>
            </div>
          )}

          {activeTab === 'options' && product.options.length > 0 && (
            <div className="space-y-4">
              {product.options.map((option, index) => (
                <div
                  key={index}
                  className="bg-gray-700/30 rounded-lg border border-white/10 p-4"
                >
                  <h5 
                    className="text-sm font-semibold text-white mb-3 cursor-pointer hover:text-blue-400 transition-colors group/item inline-flex items-center gap-2"
                    onClick={() => copyToClipboard(option.name)}
                    title="Click to copy"
                  >
                    <span>{option.name}</span>
                    <Copy className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-blue-400 flex-shrink-0" />
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <span
                        key={value}
                        className="px-3 py-1.5 bg-blue-500/20 text-blue-300 text-sm rounded cursor-pointer hover:bg-blue-500/30 transition-colors"
                        onClick={() => copyToClipboard(value)}
                        title="Click to copy"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


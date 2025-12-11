import { useState } from 'react'
import { X, Plus, Trash2, Download, FileSpreadsheet } from 'lucide-react'
import type { Product } from '../types/product'
import type { FieldMapping } from '../utils/export'
import { getAvailableProductKeys, exportToCustomCSV, exportToCustomXLS } from '../utils/export'
import toast from 'react-hot-toast'
import Select from './CustomSelect'

interface CustomExportModalProps {
  products: Product[]
  onClose: () => void
}

export default function CustomExportModal({ products, onClose }: CustomExportModalProps) {
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([
    { fieldName: 'Product Title', productKey: 'title' },
    { fieldName: 'Price', productKey: 'variants[0].price' },
  ])

  const availableKeys = getAvailableProductKeys()
  const groupedKeys = availableKeys.reduce((acc, key) => {
    if (!acc[key.category]) {
      acc[key.category] = []
    }
    acc[key.category].push({ value: key.key, label: key.label })
    return acc
  }, {} as Record<string, { value: string; label: string }[]>)

  const addField = () => {
    setFieldMappings([...fieldMappings, { fieldName: '', productKey: 'id' }])
  }

  const removeField = (index: number) => {
    setFieldMappings(fieldMappings.filter((_, i) => i !== index))
  }

  const updateField = (index: number, field: Partial<FieldMapping>) => {
    const updated = [...fieldMappings]
    updated[index] = { ...updated[index], ...field }
    setFieldMappings(updated)
  }

  const handleExport = (format: 'csv' | 'xls') => {
    // Validate mappings
    const invalidMappings = fieldMappings.filter(
      (m) => !m.fieldName.trim() || !m.productKey.trim()
    )

    if (invalidMappings.length > 0) {
      toast.error('Please fill in all field names and select product keys')
      return
    }

    if (products.length === 0) {
      toast.error('No products to export')
      return
    }

    try {
      const filename = `custom-products-${new Date().toISOString().split('T')[0]}`

      if (format === 'csv') {
        exportToCustomCSV(products, fieldMappings, filename)
        toast.success(`Exported ${products.length} product(s) to custom CSV`)
      } else {
        exportToCustomXLS(products, fieldMappings, filename)
        toast.success(`Exported ${products.length} product(s) to custom Excel`)
      }

      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Export failed')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gray-800 rounded-2xl border border-white/10 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Custom Export</h2>
            <p className="text-sm text-white/60 mt-1">
              Map CSV/Excel fields to product data keys
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/80" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="space-y-4">
            {/* Field Mappings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Field Mappings</h3>
                <button
                  onClick={addField}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm font-medium border border-blue-400/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Field</span>
                </button>
              </div>

              <div className="space-y-3">
                {fieldMappings.map((mapping, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-700/30 rounded-lg border border-white/10"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      {/* Field Name Input */}
                      <div>
                        <label className="block text-xs font-semibold text-white/70 mb-1.5">
                          CSV/Excel Column Name
                        </label>
                        <input
                          type="text"
                          value={mapping.fieldName}
                          onChange={(e) =>
                            updateField(index, { fieldName: e.target.value })
                          }
                          placeholder="e.g., Product Name"
                          className="w-full px-3 py-2 bg-gray-900/50 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400/30 text-sm"
                        />
                      </div>

                      {/* Product Key Select */}
                      <div>
                        <Select
                          label="Product Data Key"
                          value={mapping.productKey}
                          onChange={(value) =>
                            updateField(index, { productKey: value })
                          }
                          groupedOptions={groupedKeys}
                          placeholder="Select product data key..."
                          searchable={true}
                          searchPlaceholder="Search keys..."
                          showSelectedIndicator={true}
                          showItemCount={true}
                          maxHeight="300px"
                          variant="default"
                          size="md"
                        />
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeField(index)}
                      className="mt-6 p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex-shrink-0"
                      title="Remove field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {fieldMappings.length === 0 && (
                <div className="text-center py-8 text-white/60 text-sm">
                  No fields added. Click "Add Field" to create a mapping.
                </div>
              )}
            </div>

            {/* Preview Info */}
            {fieldMappings.length > 0 && (
              <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                <p className="text-sm text-blue-300">
                  <span className="font-semibold">{fieldMappings.length}</span> field(s) will be
                  exported for <span className="font-semibold">{products.length}</span> product(s)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport('csv')}
              disabled={fieldMappings.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-green-400/20"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('xls')}
              disabled={fieldMappings.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-blue-400/20"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


import { Download } from 'lucide-react'
import Table from './Table'
import type { ColumnDef } from '@tanstack/react-table'
import type { Product } from '../types/product'
import { exportToCSV, exportToJSON, exportToXLS } from '../utils/export'
import toast from 'react-hot-toast'

interface TableSectionProps {
  products: Product[]
  columns: ColumnDef<Product>[]
  isLoading: boolean
  onProductClick: (product: Product) => void
  rowSelection?: Record<string, boolean>
  onRowSelectionChange?: (selection: Record<string, boolean>) => void
}

export default function TableSection({ products, columns, isLoading, onProductClick, rowSelection, onRowSelectionChange }: TableSectionProps) {
  const getSelectedProducts = (): Product[] => {
    if (!rowSelection || Object.keys(rowSelection).length === 0) {
      return []
    }
    return products.filter(product => rowSelection[String(product.id)])
  }

  const handleExport = (format: 'csv' | 'json' | 'xls') => {
    const selectedProducts = getSelectedProducts()
    const productsToExport = selectedProducts.length > 0 ? selectedProducts : products
    const filename = selectedProducts.length > 0 
      ? `selected-products-${new Date().toISOString().split('T')[0]}`
      : `all-products-${new Date().toISOString().split('T')[0]}`

    try {
      switch (format) {
        case 'csv':
          exportToCSV(productsToExport, filename)
          toast.success(`Exported ${productsToExport.length} product(s) to CSV`)
          break
        case 'json':
          exportToJSON(productsToExport, filename)
          toast.success(`Exported ${productsToExport.length} product(s) to JSON`)
          break
        case 'xls':
          exportToXLS(productsToExport, filename)
          toast.success(`Exported ${productsToExport.length} product(s) to Excel`)
          break
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Export failed')
    }
  }

  const selectedCount = rowSelection ? Object.values(rowSelection).filter(Boolean).length : 0

  return (
    <div className="relative bg-gradient-to-b from-blue-900 via-gray-900 to-gray-900 min-h-screen py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6">
          <Table
            data={products}
            columns={columns}
            pageSize={10}
            isLoading={isLoading}
            darkMode={true}
            onRowClick={onProductClick}
            rowSelection={rowSelection}
            onRowSelectionChange={onRowSelectionChange}
            getRowId={(row) => String(row.id)}
            onExport={handleExport}
            selectedCount={selectedCount}
          />
        </div>
      </div>
    </div>
  )
}

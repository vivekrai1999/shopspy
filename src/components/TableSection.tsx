import Table from './Table'
import type { ColumnDef } from '@tanstack/react-table'
import type { Product } from '../types/product'

interface TableSectionProps {
  products: Product[]
  columns: ColumnDef<Product>[]
  isLoading: boolean
  onProductClick: (product: Product) => void
}

export default function TableSection({ products, columns, isLoading, onProductClick }: TableSectionProps) {
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
          />
        </div>
      </div>
    </div>
  )
}


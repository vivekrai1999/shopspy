import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type ColumnPinningState,
  type ColumnSizingState,
} from '@tanstack/react-table'
import { Copy, Settings2, Pin, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

interface TableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  pageSize?: number
  onRowClick?: (row: TData) => void
  isLoading?: boolean
  className?: string
  darkMode?: boolean
}

export default function Table<TData extends object>({
  data,
  columns,
  pageSize = 10,
  onRowClick,
  isLoading = false,
  className = '',
  darkMode = false,
}: TableProps<TData>) {
  const [page, setPage] = useState(1)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ id: false, handle: false })
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [],
    right: [],
  })
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
  const [showColumnMenu, setShowColumnMenu] = useState(false)

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnPinning,
      columnSizing,
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: page - 1, pageSize })
        setPage(newState.pageIndex + 1)
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    manualSorting: false,
    filterFns: {
      includesString: (row, columnId, filterValue) => {
        const value = row.getValue(columnId)
        return String(value || '').toLowerCase().includes(String(filterValue).toLowerCase())
      },
    },
    globalFilterFn: 'includesString',
  })

  const totalPages = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex + 1
  const filteredRowCount = table.getFilteredRowModel().rows.length
  const totalRowCount = table.getCoreRowModel().rows.length

  const buildPagination = (
    current: number,
    total: number,
    siblingCount = 1,
    boundaryCount = 1
  ): (number | string)[] => {
    const range = (start: number, end: number) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i)

    const startPages = range(1, Math.min(boundaryCount, total))
    const endPages = range(
      Math.max(total - boundaryCount + 1, boundaryCount + 1),
      total
    )

    const leftSibling = Math.max(current - siblingCount, boundaryCount + 1)
    const rightSibling = Math.min(current + siblingCount, total - boundaryCount)

    const items: (number | string)[] = []

    items.push(...startPages)

    if (leftSibling > boundaryCount + 1) items.push('...')

    items.push(...range(leftSibling, rightSibling))

    if (rightSibling < total - boundaryCount) items.push('...')

    for (const p of endPages) {
      if (!items.includes(p)) items.push(p)
    }

    return items
  }

  const paginationItems = buildPagination(currentPage, totalPages, 1, 1)

  const getFilterDisplayName = (filterKey: string) => {
    const col = columns.find(
      (c) => c.id === filterKey || (c as any).accessorKey === filterKey
    )

    if (col?.header) {
      return typeof col.header === 'string' ? col.header : String(col.header)
    }

    return filterKey
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }

  const truncateValue = (value: string, maxLength: number = 20) => {
    if (value.length <= maxLength) return value
    return value.substring(0, maxLength) + '...'
  }

  const activeFilters = columnFilters.filter(
    (filter) => filter.value && String(filter.value).trim() !== ''
  )

  const removeFilter = (filterKey: string) => {
    setColumnFilters((prev) => prev.filter((f) => f.id !== filterKey))
    setPage(1)
  }

  const clearAllFilters = () => {
    setColumnFilters([])
    setPage(1)
  }

  const getColumnFilterValue = (columnId: string) => {
    const filter = columnFilters.find((f) => f.id === columnId)
    return (filter?.value as string) ?? ''
  }

  const setColumnFilterValue = (columnId: string, value: string) => {
    setColumnFilters((prev) => {
      const existing = prev.find((f) => f.id === columnId)
      if (value === '') {
        return prev.filter((f) => f.id !== columnId)
      }
      if (existing) {
        return prev.map((f) => (f.id === columnId ? { ...f, value } : f))
      }
      return [...prev, { id: columnId, value }]
    })
    setPage(1)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!', {
        position: 'bottom-center',
        style: {
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#111827',
          border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e5e7eb',
        },
        iconTheme: {
          primary: darkMode ? '#60a5fa' : '#10b981',
          secondary: darkMode ? '#ffffff' : '#ffffff',
        },
      })
    } catch (err) {
      console.error('Failed to copy text: ', err)
      toast.error('Failed to copy', {
        position: 'bottom-center',
        style: {
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#111827',
          border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e5e7eb',
        },
      })
    }
  }

  const handleCopyClick = (e: React.MouseEvent, cellContent: string) => {
    e.stopPropagation() // Prevent row click
    
    if (cellContent.trim()) {
      copyToClipboard(cellContent.trim())
    }
  }

  const toggleColumnVisibility = (columnId: string) => {
    const column = table.getColumn(columnId)
    if (!column) return
    
    const isCurrentlyVisible = column.getIsVisible()
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !isCurrentlyVisible,
    }))
  }

  const toggleColumnPin = (columnId: string, side: 'left' | 'right' | false) => {
    setColumnPinning((prev) => {
      const newPinning = {
        left: [...(prev.left || [])],
        right: [...(prev.right || [])],
      }
      
      // Remove from all sides first
      newPinning.left = newPinning.left.filter((id) => id !== columnId)
      newPinning.right = newPinning.right.filter((id) => id !== columnId)
      
      // Add to the new side if specified
      if (side) {
        newPinning[side] = [...newPinning[side], columnId]
      }
      
      return newPinning
    })
  }

  const getPinnedSide = (columnId: string): 'left' | 'right' | false => {
    if ((columnPinning.left || []).includes(columnId)) return 'left'
    if ((columnPinning.right || []).includes(columnId)) return 'right'
    return false
  }

  const darkModeClasses = darkMode
    ? {
        container: 'border-white/10 bg-gray-800/40',
        header: 'border-white/10 bg-gray-800/60',
        headerText: 'text-white',
        button: 'text-white/80 bg-gray-700/50 border-white/10 hover:bg-gray-700',
        menu: 'bg-gray-800 border-white/10',
        menuItem: 'hover:bg-gray-700/50',
        menuText: 'text-white',
        menuTextMuted: 'text-white/60',
        filterSection: 'border-white/10 bg-gray-800/40',
        filterText: 'text-white',
        filterButton: 'text-white/80 hover:text-white',
        filterBadge: 'bg-gray-700 text-white border-white/20',
        tableHeader: 'bg-gray-800/60 text-white/80',
        tableCell: 'text-white/90',
        rowEven: 'bg-gray-800/30',
        rowOdd: 'bg-gray-800/50',
        rowHover: 'hover:bg-gray-700/50',
        input: 'bg-gray-900/50 border-white/10 text-white placeholder:text-white/40',
        pagination: 'text-white/80',
        paginationButton: 'bg-gray-700/50 border-white/10 text-white hover:bg-gray-600',
        paginationButtonDisabled: 'opacity-50 cursor-not-allowed',
      }
    : {
        container: 'border-gray-200/60 bg-white',
        header: 'border-gray-100 bg-gradient-to-r from-gray-50/50 to-white',
        headerText: 'text-gray-900',
        button: 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50',
        menu: 'bg-white border-gray-200',
        menuItem: 'hover:bg-gray-50',
        menuText: 'text-gray-900',
        menuTextMuted: 'text-gray-500',
        filterSection: 'border-gray-100 bg-gradient-to-r from-gray-50/50 to-white',
        filterText: 'text-gray-900',
        filterButton: 'text-gray-600 hover:text-gray-900',
        filterBadge: 'bg-gray-900 text-white',
        tableHeader: 'bg-gray-50/50 text-gray-600',
        tableCell: 'text-gray-900',
        rowEven: 'bg-white',
        rowOdd: 'bg-gray-50',
        rowHover: 'hover:bg-gray-100',
        input: 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500',
        pagination: 'text-gray-700',
        paginationButton: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
        paginationButtonDisabled: 'opacity-50 cursor-not-allowed',
      }

  return (
    <div className={`rounded-xl border ${darkModeClasses.container} shadow-sm ${className} relative`}>
        {/* Column Controls */}
        <div className={`p-4 border-b ${darkModeClasses.header} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${darkModeClasses.headerText}`}>Columns</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium ${darkModeClasses.button} rounded-lg transition-colors`}
          >
            <Settings2 className="w-4 h-4" />
            <span>Manage Columns</span>
          </button>
          
          {showColumnMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowColumnMenu(false)}
              />
              <div className={`absolute right-0 mt-2 w-64 ${darkModeClasses.menu} rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto scrollbar-hide border`}>
                <div className="p-2">
                  <div className={`px-3 py-2 text-xs font-semibold ${darkModeClasses.menuTextMuted} uppercase tracking-wider border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    Show/Hide Columns
                  </div>
                  {table.getAllColumns().map((column) => {
                    if (column.id === 'select') return null
                    const isVisible = column.getIsVisible()
                    const pinnedSide = getPinnedSide(column.id)
                    
                    return (
                      <div
                        key={column.id}
                        className={`flex items-center justify-between px-3 py-2 ${darkModeClasses.menuItem} rounded-md transition-colors`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <button
                            onClick={() => toggleColumnVisibility(column.id)}
                            className="flex items-center gap-2 flex-1 text-left"
                          >
                            {isVisible ? (
                              <Eye className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-gray-600'} flex-shrink-0`} />
                            ) : (
                              <EyeOff className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'} flex-shrink-0`} />
                            )}
                            <span className={`text-sm ${isVisible ? darkModeClasses.menuText : darkModeClasses.menuTextMuted}`}>
                              {typeof column.columnDef.header === 'string'
                                ? column.columnDef.header
                                : column.id}
                            </span>
                          </button>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => toggleColumnPin(column.id, pinnedSide === 'left' ? false : 'left')}
                            className={`p-1.5 rounded transition-colors ${
                              pinnedSide === 'left'
                                ? darkMode ? 'bg-blue-500 text-white' : 'bg-gray-900 text-white'
                                : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title="Pin left"
                          >
                            <Pin className="w-3.5 h-3.5 rotate-[-45deg]" />
                          </button>
                          <button
                            onClick={() => toggleColumnPin(column.id, pinnedSide === 'right' ? false : 'right')}
                            className={`p-1.5 rounded transition-colors ${
                              pinnedSide === 'right'
                                ? darkMode ? 'bg-blue-500 text-white' : 'bg-gray-900 text-white'
                                : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title="Pin right"
                          >
                            <Pin className="w-3.5 h-3.5 rotate-[45deg]" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className={`p-4 border-b ${darkModeClasses.filterSection}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-semibold ${darkModeClasses.filterText}`}>Active Filters</span>
            <button
              onClick={clearAllFilters}
              className={`text-xs font-medium ${darkModeClasses.filterButton} transition-colors`}
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <div
                key={filter.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${darkModeClasses.filterBadge} rounded-lg text-xs font-medium shadow-sm border`}
              >
                <span>{getFilterDisplayName(filter.id)}:</span>
                <span className={darkMode ? 'text-white/80' : 'text-gray-200'}>{truncateValue(String(filter.value))}</span>
                <button
                  onClick={() => removeFilter(filter.id)}
                  className={`ml-0.5 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-white'} focus:outline-none transition-colors`}
                  title="Remove filter"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const pinnedSide = getPinnedSide(header.column.id)
                  const isPinned = pinnedSide !== false
                  
                  return (
                    <th
                      key={header.id}
                      className={`px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${darkModeClasses.tableHeader} ${
                        isPinned ? `sticky z-10 ${darkMode ? 'bg-gray-800/80' : 'bg-gray-50'}` : ''
                      } ${
                        pinnedSide === 'left' ? 'left-0' : ''
                      } ${
                        pinnedSide === 'right' ? 'right-0' : ''
                      }`}
                      style={{
                        width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined,
                        minWidth: header.column.columnDef.minSize ? `${header.column.columnDef.minSize}px` : undefined,
                        maxWidth: header.column.columnDef.maxSize ? `${header.column.columnDef.maxSize}px` : undefined,
                        ...(isPinned
                          ? (() => {
                              if (pinnedSide === 'left') {
                                const leftIndex = (columnPinning.left || []).indexOf(header.column.id)
                                return { left: `${leftIndex * 200}px` }
                              } else {
                                const rightPinned = columnPinning.right || []
                                const rightIndex = rightPinned.indexOf(header.column.id)
                                const columnsAfter = rightPinned.length - rightIndex - 1
                                return { right: `${columnsAfter * 200}px` }
                              }
                            })()
                          : {}),
                      }}
                    >
                    <div
                      className="flex flex-col gap-2"
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flex items-center justify-between whitespace-nowrap">
                        <span className="truncate">{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        <span className={`ml-2 flex-shrink-0 ${darkMode ? 'text-white/60' : 'text-gray-400'}`}>
                          {header.column.getIsSorted() === 'asc' && '↑'}
                          {header.column.getIsSorted() === 'desc' && '↓'}
                        </span>
                      </div>
                      {header.column.getCanFilter() && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            placeholder="Filter..."
                            className={`w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-500 focus:border-blue-400/30' : 'focus:ring-gray-900/10 focus:border-gray-300'} transition-all ${darkModeClasses.input}`}
                            value={getColumnFilterValue(header.column.id)}
                            onChange={(e) => {
                              setColumnFilterValue(header.column.id, e.target.value)
                            }}
                          />
                        </div>
                      )}
                    </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className={darkMode ? 'divide-y divide-white/10' : 'divide-y divide-gray-100/50'}>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, rowIndex) => (
                <tr key={`skeleton-row-${rowIndex}`} className="animate-pulse">
                  {columns.map((_, colIndex) => (
                    <td
                      key={`skeleton-cell-${rowIndex}-${colIndex}`}
                      className="px-4 py-2.5"
                    >
                      <div className={`h-4 ${darkMode ? 'bg-gray-700/60' : 'bg-gray-200/60'} rounded-md w-full`}></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (table?.getRowModel()?.rows?.length || 0) === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={`px-4 py-8 text-center text-sm ${darkModeClasses.menuTextMuted}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span>No data available</span>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`transition-all duration-200 cursor-pointer ${
                    rowIndex % 2 === 0
                      ? darkModeClasses.rowEven
                      : darkModeClasses.rowOdd
                  } ${darkModeClasses.rowHover}`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const cellValue = cell.getValue()
                    // Get text representation for copying
                    const cellText = cellValue 
                      ? (typeof cellValue === 'object' ? JSON.stringify(cellValue) : String(cellValue))
                      : ''
                    const cellElement = flexRender(cell.column.columnDef.cell, cell.getContext())
                    
                    const pinnedSide = getPinnedSide(cell.column.id)
                    const isPinned = pinnedSide !== false
                    
                    return (
                      <td
                        key={cell.id}
                        className={`px-4 py-2.5 text-sm ${darkModeClasses.tableCell} group relative ${
                          isPinned ? 'sticky z-10' : ''
                        } ${
                          pinnedSide === 'left' ? 'left-0' : ''
                        } ${
                          pinnedSide === 'right' ? 'right-0' : ''
                        } ${
                          isPinned
                            ? rowIndex % 2 === 0
                              ? darkModeClasses.rowEven
                              : darkModeClasses.rowOdd
                            : ''
                        }`}
                        style={{
                          width: cell.column.getSize() !== 150 ? `${cell.column.getSize()}px` : undefined,
                          minWidth: cell.column.columnDef.minSize ? `${cell.column.columnDef.minSize}px` : undefined,
                          maxWidth: cell.column.columnDef.maxSize ? `${cell.column.columnDef.maxSize}px` : undefined,
                          ...(isPinned
                            ? (() => {
                                if (pinnedSide === 'left') {
                                  const leftIndex = (columnPinning.left || []).indexOf(cell.column.id)
                                  return { left: `${leftIndex * 200}px` }
                                } else {
                                  const rightPinned = columnPinning.right || []
                                  const rightIndex = rightPinned.indexOf(cell.column.id)
                                  const columnsAfter = rightPinned.length - rightIndex - 1
                                  return { right: `${columnsAfter * 200}px` }
                                }
                              })()
                            : {}),
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex-1">
                            {cellElement}
                          </span>
                          {cellText && (
                            <button
                              onClick={(e) => handleCopyClick(e, cellText)}
                              className={`opacity-0 group-hover:opacity-100 transition-all p-1.5 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded-md flex-shrink-0 active:scale-95`}
                              title="Copy to clipboard"
                            >
                              <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-gray-600'}`} />
                            </button>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 ${darkMode ? 'bg-gray-800/40 border-white/10' : 'bg-gray-50/30 border-gray-100'} border-t`}>
        <div className={`text-sm ${darkModeClasses.pagination}`}>
          {filteredRowCount > 0 ? (
            <>
              Showing <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{Math.min(currentPage * pageSize, filteredRowCount)}</span> of{' '}
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{filteredRowCount}</span> entries
              {filteredRowCount !== totalRowCount && (
                <span className={darkMode ? 'text-white/60' : 'text-gray-500'} style={{ marginLeft: '0.25rem' }}>
                  (filtered from {totalRowCount})
                </span>
              )}
            </>
          ) : (
            <span className={darkMode ? 'text-white/60' : 'text-gray-500'}>No entries</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              table.previousPage()
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all active:scale-95 ${darkModeClasses.paginationButton} ${darkModeClasses.paginationButtonDisabled}`}
          >
            Previous
          </button>
          <div className="hidden sm:flex items-center gap-1">
            {paginationItems.map((item, idx) =>
              typeof item === 'number' ? (
                <button
                  key={`${item}-${idx}`}
                  onClick={() => {
                    table.setPageIndex(item - 1)
                  }}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all active:scale-95 ${
                    currentPage === item
                      ? darkMode ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-900 text-white shadow-sm'
                      : darkModeClasses.paginationButton
                  }`}
                >
                  {item}
                </button>
              ) : (
                <span key={`dots-${idx}`} className={`px-2 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                  …
                </span>
              )
            )}
          </div>
          <button
            disabled={!table.getCanNextPage()}
            onClick={() => {
              table.nextPage()
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all active:scale-95 ${darkModeClasses.paginationButton} ${darkModeClasses.paginationButtonDisabled}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

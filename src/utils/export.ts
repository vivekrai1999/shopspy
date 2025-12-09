import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import type { Product } from '../types/product'

export function exportToCSV(products: Product[], filename: string = 'products') {
  if (products.length === 0) {
    throw new Error('No products to export')
  }

  // Get all unique keys from products
  const allKeys = new Set<string>()
  products.forEach(product => {
    Object.keys(product).forEach(key => allKeys.add(key))
  })

  const headers = Array.from(allKeys)
  
  // Create CSV content
  const csvRows: string[] = []
  
  // Add headers
  csvRows.push(headers.map(header => `"${header}"`).join(','))
  
  // Add rows
  products.forEach(product => {
    const row = headers.map(header => {
      const value = (product as any)[header]
      if (value === null || value === undefined) return '""'
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`
      }
      return `"${String(value).replace(/"/g, '""')}"`
    })
    csvRows.push(row.join(','))
  })
  
  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `${filename}.csv`)
}

export function exportToJSON(products: Product[], filename: string = 'products') {
  if (products.length === 0) {
    throw new Error('No products to export')
  }

  const jsonContent = JSON.stringify(products, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  saveAs(blob, `${filename}.json`)
}

export function exportToXLS(products: Product[], filename: string = 'products') {
  if (products.length === 0) {
    throw new Error('No products to export')
  }

  // Flatten products for Excel export
  const flattenedProducts = products.map(product => {
    const flat: any = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      vendor: product.vendor,
      product_type: product.product_type,
      tags: product.tags.join(', '),
      body_html: product.body_html ? product.body_html.replace(/<[^>]*>/g, '').substring(0, 100) : '',
      created_at: product.created_at,
      updated_at: product.updated_at,
      published_at: product.published_at,
      variants_count: product.variants.length,
      images_count: product.images.length,
    }

    // Add first variant details
    if (product.variants.length > 0) {
      const firstVariant = product.variants[0]
      flat.price = firstVariant.price
      flat.compare_at_price = firstVariant.compare_at_price || ''
      flat.sku = firstVariant.sku || ''
      flat.available = firstVariant.available ? 'Yes' : 'No'
      flat.requires_shipping = firstVariant.requires_shipping ? 'Yes' : 'No'
      flat.taxable = firstVariant.taxable ? 'Yes' : 'No'
      flat.grams = firstVariant.grams || 0
    }

    // Add options
    if (product.options.length > 0) {
      flat.options = product.options.map(opt => `${opt.name}: ${opt.values.join(', ')}`).join('; ')
    }

    return flat
  })

  const worksheet = XLSX.utils.json_to_sheet(flattenedProducts)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `${filename}.xlsx`)
}


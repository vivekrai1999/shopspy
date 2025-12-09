import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import type { Product } from '../types/product'

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

/**
 * Escapes CSV values properly
 */
function escapeCSV(value: any): string {
  if (value === null || value === undefined || value === '') {
    return ''
  }
  const stringValue = String(value)
  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

/**
 * Exports products to Shopify-compatible CSV format
 * This format can be directly imported into Shopify stores
 */
export function exportToShopifyCSV(products: Product[], filename: string = 'shopify-products') {
  if (products.length === 0) {
    throw new Error('No products to export')
  }

  // Shopify CSV headers
  const headers = [
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Product Category',
    'Type',
    'Tags',
    'Published',
    'Option1 Name',
    'Option1 Value',
    'Option1 Linked To',
    'Option2 Name',
    'Option2 Value',
    'Option2 Linked To',
    'Option3 Name',
    'Option3 Value',
    'Option3 Linked To',
    'Variant SKU',
    'Variant Grams',
    'Variant Inventory Tracker',
    'Variant Inventory Qty',
    'Variant Inventory Policy',
    'Variant Fulfillment Service',
    'Variant Price',
    'Variant Compare At Price',
    'Variant Requires Shipping',
    'Variant Taxable',
    'Unit Price Total Measure',
    'Unit Price Total Measure Unit',
    'Unit Price Base Measure',
    'Unit Price Base Measure Unit',
    'Variant Barcode',
    'Image Src',
    'Image Position',
    'Image Alt Text',
    'Gift Card',
    'SEO Title',
    'SEO Description',
    'Variant Image',
    'Variant Weight Unit',
    'Variant Tax Code',
    'Cost per item',
    'Status',
  ]

  const csvRows: string[] = []
  csvRows.push(headers.map(escapeCSV).join(','))

  products.forEach((product) => {
    const handle = product.handle || ''
    const title = product.title || ''
    const bodyHtml = product.body_html || ''
    const vendor = product.vendor || ''
    const productType = product.product_type || ''
    const tags = product.tags.join(', ') || ''
    const published = product.published_at ? 'true' : 'false'
    const status = product.published_at ? 'active' : 'draft'

    // Get option names
    const option1Name = product.options[0]?.name || ''
    const option2Name = product.options[1]?.name || ''
    const option3Name = product.options[2]?.name || ''

    // If product has no variants, create a single row with default variant
    if (product.variants.length === 0) {
      const row = [
        handle,
        title,
        bodyHtml,
        vendor,
        '', // Product Category
        productType,
        tags,
        published,
        '', // Option1 Name
        '', // Option1 Value
        '', // Option1 Linked To
        '', // Option2 Name
        '', // Option2 Value
        '', // Option2 Linked To
        '', // Option3 Name
        '', // Option3 Value
        '', // Option3 Linked To
        '', // Variant SKU
        '0.0', // Variant Grams
        '', // Variant Inventory Tracker
        '0', // Variant Inventory Qty
        'deny', // Variant Inventory Policy
        'manual', // Variant Fulfillment Service
        '', // Variant Price
        '', // Variant Compare At Price
        'true', // Variant Requires Shipping
        'true', // Variant Taxable
        '', // Unit Price Total Measure
        '', // Unit Price Total Measure Unit
        '', // Unit Price Base Measure
        '', // Unit Price Base Measure Unit
        '', // Variant Barcode
        product.images[0]?.src || '', // Image Src
        '1', // Image Position
        '', // Image Alt Text
        'false', // Gift Card
        '', // SEO Title
        '', // SEO Description
        '', // Variant Image
        'kg', // Variant Weight Unit
        '', // Variant Tax Code
        '', // Cost per item
        status,
      ]
      csvRows.push(row.map(escapeCSV).join(','))
    } else {
      // Create rows for each variant
      product.variants.forEach((variant, variantIndex) => {
        const option1Value = variant.option1 || ''
        const option2Value = variant.option2 || ''
        const option3Value = variant.option3 || ''

        // Get variant image (featured image or first product image)
        const variantImage = variant.featured_image?.src || product.images[0]?.src || ''

        // First row for this variant includes product info and first image
        const row = [
          handle,
          variantIndex === 0 ? title : '', // Only first variant row has title
          variantIndex === 0 ? bodyHtml : '', // Only first variant row has body
          variantIndex === 0 ? vendor : '', // Only first variant row has vendor
          variantIndex === 0 ? '' : '', // Product Category
          variantIndex === 0 ? productType : '', // Only first variant row has type
          variantIndex === 0 ? tags : '', // Only first variant row has tags
          variantIndex === 0 ? published : '', // Only first variant row has published
          variantIndex === 0 ? option1Name : '', // Only first variant row has option names
          option1Value,
          '', // Option1 Linked To
          variantIndex === 0 ? option2Name : '',
          option2Value,
          '', // Option2 Linked To
          variantIndex === 0 ? option3Name : '',
          option3Value,
          '', // Option3 Linked To
          variant.sku || '',
          String(variant.grams || 0),
          '', // Variant Inventory Tracker
          '0', // Variant Inventory Qty
          'deny', // Variant Inventory Policy
          'manual', // Variant Fulfillment Service
          variant.price || '',
          variant.compare_at_price || '',
          variant.requires_shipping ? 'true' : 'false',
          variant.taxable ? 'true' : 'false',
          '', // Unit Price Total Measure
          '', // Unit Price Total Measure Unit
          '', // Unit Price Base Measure
          '', // Unit Price Base Measure Unit
          '', // Variant Barcode
          variantIndex === 0 && product.images[0] ? product.images[0].src : '', // First image on first variant row
          variantIndex === 0 && product.images[0] ? '1' : '', // Image Position
          '', // Image Alt Text
          'false', // Gift Card
          '', // SEO Title
          '', // SEO Description
          variantImage, // Variant Image
          'kg', // Variant Weight Unit
          '', // Variant Tax Code
          '', // Cost per item
          variantIndex === 0 ? status : '', // Only first variant row has status
        ]
        csvRows.push(row.map(escapeCSV).join(','))
      })

      // Add additional image rows after all variants (if any)
      if (product.images.length > 1) {
        product.images.slice(1).forEach((image, imageIndex) => {
          const imageRow = [
            handle,
            '', // Title
            '', // Body HTML
            '', // Vendor
            '', // Product Category
            '', // Type
            '', // Tags
            '', // Published
            '', // Option1 Name
            '', // Option1 Value
            '', // Option1 Linked To
            '', // Option2 Name
            '', // Option2 Value
            '', // Option2 Linked To
            '', // Option3 Name
            '', // Option3 Value
            '', // Option3 Linked To
            '', // Variant SKU
            '', // Variant Grams
            '', // Variant Inventory Tracker
            '', // Variant Inventory Qty
            '', // Variant Inventory Policy
            '', // Variant Fulfillment Service
            '', // Variant Price
            '', // Variant Compare At Price
            '', // Variant Requires Shipping
            '', // Variant Taxable
            '', // Unit Price Total Measure
            '', // Unit Price Total Measure Unit
            '', // Unit Price Base Measure
            '', // Unit Price Base Measure Unit
            '', // Variant Barcode
            image.src, // Image Src
            String(imageIndex + 2), // Image Position
            '', // Image Alt Text
            '', // Gift Card
            '', // SEO Title
            '', // SEO Description
            '', // Variant Image
            '', // Variant Weight Unit
            '', // Variant Tax Code
            '', // Cost per item
            '', // Status
          ]
          csvRows.push(imageRow.map(escapeCSV).join(','))
        })
      }
    }
  })

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `${filename}.csv`)
}


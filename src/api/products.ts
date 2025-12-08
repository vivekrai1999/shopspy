import type { ProductsResponse, ProductsQueryParams, Product } from '../types/product'

// Normalize URL to ensure it has a protocol
function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  
  // If URL already has a protocol, return as is
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  
  // Add https:// if no protocol
  return `https://${trimmed}`
}

export async function fetchProducts(
  params: ProductsQueryParams = {}
): Promise<ProductsResponse> {
  const { limit = 10, page = 1, baseUrl } = params

  if (!baseUrl) {
    throw new Error('Base URL is required')
  }

  const normalizedUrl = normalizeUrl(baseUrl)
  const url = new URL('/products.json', normalizedUrl)
  url.searchParams.set('limit', limit.toString())
  url.searchParams.set('page', page.toString())

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }

  return response.json()
}

export async function getAllProducts(
  baseUrl: string,
  signal?: AbortSignal,
  onProgress?: (page: number, fetchedCount: number) => void
): Promise<Product[]> {
  if (!baseUrl) {
    throw new Error('Base URL is required')
  }

  const normalizedUrl = normalizeUrl(baseUrl)
  let allProducts: Product[] = []
  let limit = 250
  let page = 1
  let fetchedProducts = 0

  try {
    while (true) {
      if (signal?.aborted) {
        return []
      }

      const url = new URL('/products.json', normalizedUrl)
      url.searchParams.set('limit', limit.toString())
      url.searchParams.set('page', page.toString())

      const response = await fetch(url.toString(), { signal })

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`)
      }

      const data: ProductsResponse = await response.json()
      const products = data?.products || []

      fetchedProducts += products.length
      allProducts = [...allProducts, ...products]

      if (onProgress) {
        onProgress(page, fetchedProducts)
      }

      if (products.length < limit) {
        break
      }

      page++
    }

    return allProducts
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('Fetch aborted')
      return []
    } else {
      console.error('Error fetching products:', error)
      throw error
    }
  }
}


import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../products'
import type { ProductsQueryParams } from '../../types/product'

export function useProducts(params: ProductsQueryParams = {}) {
  const { limit = 10, page = 1, baseUrl } = params

  return useQuery({
    queryKey: ['products', limit, page, baseUrl],
    queryFn: () => fetchProducts({ limit, page, baseUrl }),
    enabled: !!baseUrl,
    staleTime: 1000 * 60 * 5,
  })
}


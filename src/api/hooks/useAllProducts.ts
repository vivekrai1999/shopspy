import { useQuery } from '@tanstack/react-query'
import { getAllProducts } from '../products'
import { useState } from 'react'

export interface UseAllProductsParams {
  baseUrl?: string
  enabled?: boolean
}

export function useAllProducts({ baseUrl, enabled = true }: UseAllProductsParams) {
  const [progress, setProgress] = useState({ page: 0, fetchedCount: 0 })

  return useQuery({
    queryKey: ['allProducts', baseUrl],
    queryFn: ({ signal }) => {
      if (!baseUrl) {
        throw new Error('Base URL is required')
      }
      return getAllProducts(
        baseUrl,
        signal,
        (page, fetchedCount) => {
          setProgress({ page, fetchedCount })
        }
      )
    },
    enabled: enabled && !!baseUrl,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useAllProductsWithProgress({ baseUrl, enabled = true }: UseAllProductsParams) {
  const [progress, setProgress] = useState({ page: 0, fetchedCount: 0 })

  const query = useQuery({
    queryKey: ['allProducts', baseUrl],
    queryFn: ({ signal }) => {
      if (!baseUrl) {
        throw new Error('Base URL is required')
      }
      return getAllProducts(
        baseUrl,
        signal,
        (page, fetchedCount) => {
          setProgress({ page, fetchedCount })
        }
      )
    },
    enabled: enabled && !!baseUrl,
    staleTime: 1000 * 60 * 5,
  })

  return {
    ...query,
    progress,
  }
}


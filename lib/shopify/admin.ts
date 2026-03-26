import { adminFetch } from '@/lib/shopify'

export async function shopifyAdminFetch<T = unknown>({
  query,
  variables = {},
}: {
  query: string
  variables?: Record<string, unknown>
}): Promise<T | null> {
  return adminFetch<T>(query, variables)
}

export default { shopifyAdminFetch }

export function parseShopifyDomain(domain: string) {
  const normalized = domain
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
  if (!normalized.endsWith('.myshopify.com')) {
    return `${normalized}.myshopify.com`
  }
  return normalized
}

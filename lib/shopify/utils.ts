export function getShopifyProductId(globalId: string) {
  const segments = globalId.split('/')
  return segments.pop() ?? globalId
}

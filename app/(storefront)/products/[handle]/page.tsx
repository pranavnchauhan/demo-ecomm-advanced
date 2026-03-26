import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProduct, getProducts } from "@/lib/shopify"
import { ProductGallery } from "@/components/products/product-gallery"
import { ProductInfo } from "@/components/products/product-info"
import { ProductCard } from "@/components/products/product-card"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return { title: "Product Not Found" }

  return {
    title: product.title,
    description: product.description?.slice(0, 160),
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  let relatedProducts: Awaited<ReturnType<typeof getProducts>> = []
  try {
    const allProducts = await getProducts({ first: 5, sortKey: "BEST_SELLING" })
    relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4)
  } catch {
    // Ignore
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
      {/* Product detail */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="font-serif text-2xl tracking-wide text-foreground">
            You May Also Like
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

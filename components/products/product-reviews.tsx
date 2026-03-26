import Link from "next/link"
import { fetchProductReviews } from "@/lib/judgeme"
import { StarRating } from "./star-rating"

type Props = {
  productId: string   // Shopify GID e.g. "gid://shopify/Product/8891627708706"
  handle: string      // product handle for pagination links
  currentPage?: number
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Review links mapped by product handle — add entries as products are set up
const REVIEW_LINKS: Record<string, string> = {}

// ── Demo reviews shown when Judge.me is not configured ─────────────
import type { JudgeMeReview } from "@/lib/judgeme"

const DEMO_REVIEWS: JudgeMeReview[] = [
  {
    id: 1001,
    title: "Absolutely love this product!",
    body: "This has become a staple in my daily self-care routine. The scent is incredible and my skin feels so soft and nourished. Australian made quality you can really feel the difference.",
    rating: 5,
    reviewer: { name: "Sarah M.", tags: ["Verified Buyer"] },
    verified: "buyer",
    created_at: "2026-03-10T09:00:00Z",
    pictures: [],
  },
  {
    id: 1002,
    title: "Perfect gift idea",
    body: "Bought this as a gift for my mum and she couldn't stop raving about it. The packaging is beautiful and the product itself is luxurious. Will definitely be ordering more for myself!",
    rating: 5,
    reviewer: { name: "James K.", tags: ["Verified Buyer"] },
    verified: "buyer",
    created_at: "2026-02-22T14:30:00Z",
    pictures: [],
  },
  {
    id: 1003,
    title: "Natural ingredients make all the difference",
    body: "I have really sensitive skin and most products irritate me. This one is gentle, smells amazing, and actually works. So glad I found a brand that uses 100% natural ingredients.",
    rating: 5,
    reviewer: { name: "Emma L.", tags: ["Verified Buyer"] },
    verified: "buyer",
    created_at: "2026-02-05T11:15:00Z",
    pictures: [],
  },
  {
    id: 1004,
    title: "Will keep repurchasing",
    body: "Third time ordering and the quality is consistently excellent. Love supporting an Australian brand that cares about sustainability. The eco-friendly packaging is a nice touch too.",
    rating: 4,
    reviewer: { name: "Olivia T." },
    verified: "unverified",
    created_at: "2026-01-18T08:45:00Z",
    pictures: [],
  },
]

const DEMO_RATING = {
  average: 4.8,
  count: 4,
}

export async function ProductReviews({
  productId,
  handle,
  currentPage = 1,
}: Props) {
  const hasJudgeMe = !!process.env.JUDGEME_PRIVATE_TOKEN
  const { reviews, rating, totalPages } = hasJudgeMe
    ? await fetchProductReviews(productId, currentPage)
    : { reviews: DEMO_REVIEWS, rating: DEMO_RATING, totalPages: 1 }

  const writeUrl =
    REVIEW_LINKS[handle] ??
    "https://judge.me/product_reviews/bf4506a0-6669-403e-af4f-db766e04ba76/new?source=shareable-link"

  return (
    <div className="mt-8 border-t border-border pt-6">
      {/* Section heading */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
          Reviews
        </h3>
        <Link
          href={writeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary underline-offset-2 hover:underline"
        >
          Write a review
        </Link>
      </div>

      {/* Rating summary */}
      {rating.count > 0 ? (
        <div className="mb-6 flex items-center gap-3">
          <span className="font-serif text-3xl text-foreground">
            {rating.average.toFixed(1)}
          </span>
          <div>
            <StarRating rating={rating.average} size="md" />
            <p className="mt-0.5 text-xs text-muted-foreground">
              {rating.count} {rating.count === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-md border border-border bg-[#FAF8F4] px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Be the first to share your experience.
          </p>
          <Link
            href={writeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded border border-primary px-5 py-2 text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Write a Review
          </Link>
        </div>
      )}

      {/* Review cards */}
      {reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => {
            const isVerified =
              review.verified === "buyer" ||
              review.reviewer.tags?.includes("Verified Buyer")
            return (
              <div
                key={review.id}
                className="rounded-md border border-border bg-[#FAF8F4] p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <StarRating rating={review.rating} size="sm" />
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {review.reviewer.name}
                      </span>
                      {isVerified && (
                        <span className="inline-flex items-center rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#B8960C]">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                {review.title && (
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {review.title}
                  </p>
                )}
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {review.body}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-6">
          {currentPage > 1 && (
            <Link
              href={`/shop/${handle}?reviewPage=${currentPage - 1}`}
              className="text-xs text-primary underline-offset-2 hover:underline"
            >
              &larr; Previous
            </Link>
          )}
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/shop/${handle}?reviewPage=${currentPage + 1}`}
              className="text-xs text-primary underline-offset-2 hover:underline"
            >
              Next &rarr;
            </Link>
          )}
        </div>
      )}

      {/* Write a review CTA */}
      {reviews.length > 0 && (
        <div className="mt-5 text-center">
          <Link
            href={writeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded border border-primary px-5 py-2 text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Write a Review
          </Link>
        </div>
      )}
    </div>
  )
}

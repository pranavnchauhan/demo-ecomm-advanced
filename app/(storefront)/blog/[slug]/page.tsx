import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostBySlug, blogPosts } from "@/lib/blog-data"
import { BlogPostLayout } from "@/components/blog/blog-post-layout"
import { brand } from "@/config/brand"

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: `${post.title} | ${brand.name} Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.image }],
    },
    alternates: {
      canonical: `https://www.${brand.domain}/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <BlogPostLayout post={post}>
      <p>{post.excerpt}</p>
      <p>
        This article is coming soon. Check back for the full guide from the{" "}
        <Link href="/about" className="text-primary hover:underline">{brand.name}</Link> team.
      </p>
      <p>
        In the meantime, explore our{" "}
        <Link href="/shop" className="text-primary hover:underline">full range of natural body care products</Link>
        {" "}or take our{" "}
        <Link href="/quiz" className="text-primary hover:underline">quiz</Link>
        {" "}to find the right products for you.
      </p>
    </BlogPostLayout>
  )
}

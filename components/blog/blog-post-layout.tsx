"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Link2, Facebook } from "lucide-react"
import type { BlogPost } from "@/lib/blog-data"
import { getRelatedPosts } from "@/lib/blog-data"

interface BlogPostLayoutProps {
  post: BlogPost
  children: React.ReactNode
}

export function BlogPostLayout({ post, children }: BlogPostLayoutProps) {
  const related = getRelatedPosts(post.slug)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400')
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.saltandstone.com.au/" },
      { "@type": "ListItem", "position": 2, "name": "Journal", "item": "https://www.saltandstone.com.au/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title },
    ],
  }

  const imageUrl = post.image.startsWith("http") ? post.image : `https://www.saltandstone.com.au${post.image}`

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": imageUrl,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "Salt & Stone AU",
      "url": "https://www.saltandstone.com.au",
      "description": "Handcrafted natural body care and home essentials. Australian made with pure ingredients.",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Salt & Stone AU",
      "logo": { "@type": "ImageObject", "url": "https://www.saltandstone.com.au/images/logo.svg" },
    },
    "mainEntityOfPage": `https://www.saltandstone.com.au/blog/${post.slug}`,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".prose h2", ".prose p:first-of-type"],
    },
  }

  return (
    <main className="bg-background pt-36 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12 mb-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground transition-colors">Journal</Link>
          <span>/</span>
          <span className="text-foreground">{post.title}</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="max-w-3xl">
          <span className="font-sans text-xs tracking-[0.2em] uppercase text-primary">
            {post.category}
          </span>
          <h1 className="mt-3 font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            {post.title}
          </h1>
          <div className="mt-4 text-sm text-muted-foreground">
            {post.readTime}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{post.author}</span>
            <span className="text-border">|</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative mx-auto mt-12 max-w-7xl px-6 lg:px-12">
        <div className="relative aspect-[21/9] overflow-hidden rounded-md">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Article body */}
      <article className="mx-auto mt-16 max-w-3xl px-6 lg:px-12">
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-li:text-muted-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground">
          {children}
        </div>

        {/* Tags */}
        <div className="mt-16 border-t border-border pt-8">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Tags
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-secondary px-3 py-1.5 font-sans text-xs tracking-wide text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Share buttons */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            <Link2 className="h-3.5 w-3.5" />
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={handleShareFacebook}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            <Facebook className="h-3.5 w-3.5" />
            Share on Facebook
          </button>
        </div>

        {/* Author bio */}
        <div className="mt-12 flex items-start gap-5 rounded border border-border bg-secondary p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-icon.svg"
            alt="Salt & Stone AU"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full bg-background p-2"
          />
          <div>
            <p className="font-serif text-base font-medium text-foreground">
              Salt & Stone AU Team
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Written by the Salt & Stone AU team. We are Australian makers of natural body care and home essentials — handcrafted with pure ingredients, cruelty free, and eco-friendly.
            </p>
            <Link
              href="/about"
              className="mt-2 inline-block text-xs tracking-wide uppercase text-primary hover:underline"
            >
              Learn more about us
            </Link>
          </div>
        </div>
      </article>

      {/* Related posts */}
      <section className="mx-auto mt-24 max-w-7xl px-6 lg:px-12">
        <div className="border-t border-border pt-16">
          <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            More from the Journal
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-md border border-border bg-card transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-primary">
                    {p.category}
                  </span>
                  <h3 className="mt-2 font-serif text-xl tracking-tight text-card-foreground text-balance">
                    {p.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-primary transition-colors group-hover:text-foreground">
                    Read More
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-24 max-w-3xl px-6 text-center lg:px-12">
        <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary">
          Ready to make the switch?
        </p>
        <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground md:text-4xl text-balance">
          Nature. Refined.
        </h2>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center justify-center gap-3 bg-foreground px-10 py-4 font-sans text-sm tracking-[0.2em] uppercase text-background transition-all hover:bg-foreground/90"
        >
          Shop Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  )
}

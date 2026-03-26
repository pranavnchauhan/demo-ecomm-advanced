import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { blogPosts } from "@/lib/blog-data"

export const metadata: Metadata = {
  title: "Journal | Natural Body Care Tips & Wellness",
  description: "Natural body care tips, self-care rituals, and wellness guides from the Salt & Stone AU team.",
  alternates: {
    canonical: "https://www.saltandstone.com.au/blog",
  },
}

export default function BlogPage() {
  const [featured, ...rest] = blogPosts

  return (
    <main className="bg-background pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-2xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Journal</span>
          </nav>
          <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl text-balance">
            Nature. Refined. The Journal.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Self-care rituals, natural ingredient guides, and wellness inspiration from the Salt & Stone AU team.
          </p>
        </div>

        {/* Featured post */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group mt-16 grid gap-8 overflow-hidden rounded-md border border-border bg-card lg:grid-cols-2"
        >
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[400px]">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <span className="font-sans text-xs tracking-[0.2em] uppercase text-primary">
              {featured.category}
            </span>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-card-foreground md:text-4xl text-balance">
              {featured.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
              {featured.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <time dateTime={featured.date}>
                {new Date(featured.date).toLocaleDateString("en-AU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="text-border">|</span>
              <span>{featured.readTime}</span>
            </div>
            <span className="mt-8 inline-flex items-center gap-2 font-sans text-sm tracking-[0.2em] uppercase text-primary transition-colors group-hover:text-foreground">
              Read Article
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        {/* Post grid */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-md border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="font-sans text-xs tracking-[0.2em] uppercase text-primary">
                  {post.category}
                </span>
                <h3 className="mt-2 font-serif text-xl tracking-tight text-card-foreground md:text-2xl text-balance">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-AU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span className="text-border">|</span>
                  <span>{post.readTime}</span>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-primary transition-colors group-hover:text-foreground">
                  Read More
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

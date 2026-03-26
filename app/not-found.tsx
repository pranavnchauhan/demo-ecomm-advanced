import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-sans text-xs tracking-[0.4em] uppercase text-primary">
        404
      </p>
      <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        The page you are looking for may have moved or no longer exists.
      </p>
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 bg-primary px-10 py-4 font-sans text-xs tracking-[0.3em] uppercase text-primary-foreground transition-colors hover:bg-primary/85"
        >
          Shop Now
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-foreground px-10 py-4 font-sans text-xs tracking-[0.3em] uppercase text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}

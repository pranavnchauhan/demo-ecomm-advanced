import { brand } from "@/config/brand"

export function TrustBar() {
  const items = brand.trustBar

  return (
    <section className="overflow-hidden border-y border-border bg-secondary py-4">
      <div className="animate-marquee flex w-max gap-16">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 whitespace-nowrap font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            <span className="h-1 w-1 bg-primary" />
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}

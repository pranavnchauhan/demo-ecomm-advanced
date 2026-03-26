"use client"

import { useEffect, useRef } from "react"

export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    const children = el.querySelectorAll(
      ".animate-on-scroll, .animate-fade-in, .animate-scale-in, .animate-slide-left, .animate-slide-right"
    )
    children.forEach((child) => observer.observe(child))

    return () => observer.disconnect()
  }, [])

  return ref
}

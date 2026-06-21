"use client"

import { useEffect } from "react"

/**
 * Progressive-enhancement scroll reveal. Content is visible by default; the
 * `js` class (set pre-paint in the root layout) hides `.reveal` elements, and
 * this observer restores them as they enter view. A safety timeout guarantees
 * nothing stays hidden, and reduced-motion reveals everything immediately.
 */
export function ScrollReveal() {
  useEffect(() => {
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const els = Array.from(document.querySelectorAll(".reveal, .role"))
    const revealAll = () => els.forEach((el) => el.classList.add("in"))

    if (reduce || !("IntersectionObserver" in window)) {
      revealAll()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in")
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    )
    els.forEach((el) => io.observe(el))

    const t = setTimeout(revealAll, 2600)
    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  }, [])

  return null
}

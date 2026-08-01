"use client"

import { useEffect, useRef, useState } from "react"

const links = [
  { id: "profile", label: "PROFILE" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "stack", label: "STACK" },
  { id: "education", label: "EDU" },
]

export function SiteHeader() {
  const [active, setActive] = useState<string | null>(null)
  const syncRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Active-section tracking for the nav.
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: "-35% 0px -55% 0px" }
    )
    sections.forEach((s) => io.observe(s))

    // Scroll "sync" hairline under the bar.
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = syncRef.current
        if (!el) return
        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
        el.style.transform = `scaleX(${p})`
        if (p < 0.001) setActive(null)
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => {
      io.disconnect()
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="brand" href="#top">
          <span className="dot" aria-hidden="true" />
          fele.io
        </a>
        <nav className="topnav" aria-label="Sections">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? "is-active" : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="status">
          {/* Live count, updated by the topology graph. */}
          <span className="nodes-count">
            NODES <b id="topo-node-count">0x00</b>
          </span>
          <span className="online">
            <span className="pulse" aria-hidden="true" />
            ONLINE
          </span>
        </div>
      </div>
      <span className="sync" ref={syncRef} aria-hidden="true" />
    </header>
  )
}

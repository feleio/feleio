"use client"

import { useEffect, useRef, useState } from "react"

import { LINKEDIN_URL } from "@/lib/content"

const links = [
  { id: "profile", label: "PROFILE" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "stack", label: "STACK" },
  { id: "education", label: "EDU" },
  { id: "connect", label: "CONNECT" },
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
              aria-current={active === l.id ? "true" : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="status">
          {/* Live count, updated by the topology graph. Decorative flavor
              that mutates ~1/s — kept away from assistive tech. */}
          <span className="nodes-count" aria-hidden="true">
            NODES <b id="topo-node-count">0x00</b>
          </span>
          <span className="online">
            <span className="pulse" aria-hidden="true" />
            ONLINE
          </span>
          <a
            className="topbar__cta"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
            </svg>
            <span className="topbar__cta-label">CONNECT</span>
          </a>
        </div>
      </div>
      <span className="sync" ref={syncRef} aria-hidden="true" />
    </header>
  )
}

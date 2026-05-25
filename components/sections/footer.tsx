"use client"

import { Linkedin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="mx-auto flex max-w-[800px] flex-col items-center gap-5 border-t border-card-border px-6 py-14 sm:flex-row sm:justify-between">
      <div className="flex gap-4">
        <a
          href="https://www.linkedin.com/in/chun-lok-ling-195a923b"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-card-border px-4 py-2 text-[13px] text-text-secondary transition-colors hover:border-accent-ice hover:text-accent-ice"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </a>
        <a
          href="https://github.com/feleio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-card-border px-4 py-2 text-[13px] text-text-secondary transition-colors hover:border-accent-ice hover:text-accent-ice"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
      </div>
      <div className="text-[11px] text-text-subtle">
        {new Date().getFullYear()} Chun Lok Ling
      </div>
    </footer>
  )
}

// Single source of truth for site content. Section components and the hero
// topology graph both consume this, so a role edit lands everywhere at once.

export const SITE_URL = "https://fele.io"
export const LINKEDIN_URL = "https://www.linkedin.com/in/chun-lok-ling-195a923b"
export const GITHUB_URL = "https://github.com/feleio"

export interface Role {
  /** Anchor suffix (`role-${id}`) and graph node key prefix. */
  id: "da" | "bh" | "ar" | "tr"
  /** Graph node key, e.g. "DA". */
  graphId: string
  years: string
  title: string
  org: string
  team: string
  /** One-line summary of the role's remit — the card's deck line. */
  scope: string
  bullets: string[]
  tags: string[]
  /** Short skill labels drawn in the hero graph (may differ from tags). */
  graphSkills: string[]
  /** Renders the card in the tighter single-column variant. */
  compact?: boolean
}

export const roles: Role[] = [
  {
    id: "da",
    graphId: "DA",
    years: "2022 — Present",
    title: "Senior Software Engineer",
    org: "Digital Asset",
    team: "Canton Network Utility Team",
    scope: "Mission-critical backend utilities for institutional-grade DLT",
    // TODO(chun): real numbers would make these land — how many utilities,
    // what scale/SLA the Canton Network components run at.
    bullets: [
      "Build foundational distributed ledger components for the Canton Network in Scala and Daml",
      "Deliver secure, production-ready code for high-integrity institutional systems",
    ],
    tags: ["Scala", "Daml", "DLT"],
    graphSkills: ["Scala", "Daml", "DLT"],
  },
  {
    id: "bh",
    graphId: "BH",
    years: "2016 — 2022",
    title: "Senior Software Engineer",
    org: "Babylon Health",
    team: "AI Engineering",
    scope: "Scala microservices behind a global clinical platform",
    // TODO(chun): platform scale would strengthen this — users served,
    // request volume, markets/regions live.
    bullets: [
      "Designed Scala and Akka-HTTP microservices powering global clinical and chatbot platforms",
      "Owned full-lifecycle deployments with Docker and Kubernetes",
      "Partnered with clinical teams to turn complex medical requirements into high-performance code",
    ],
    tags: ["Scala", "Akka-HTTP", "Java", "Docker", "Kubernetes"],
    graphSkills: ["Scala", "Akka-HTTP", "Java", "Docker", "K8s"],
  },
  {
    id: "ar",
    graphId: "AR",
    years: "2015 — 2016",
    title: "Senior Software Engineer",
    org: "Amber Road",
    team: "",
    // TODO(chun): confirm or replace this line — placeholder based on Amber
    // Road's product domain, not your actual scope there.
    scope: "Global trade management platform engineering",
    bullets: [],
    tags: [],
    graphSkills: [],
    compact: true,
  },
  {
    id: "tr",
    graphId: "TR",
    years: "2010 — 2014",
    title: "Software Engineer",
    org: "Thomson Reuters",
    team: "",
    scope: "Core components of the Global Market Data Network",
    // TODO(chun): market-data throughput or latency figures would
    // strengthen this if you have them.
    bullets: [
      "Developed core C++ components for the Global Market Data Network",
      "Shipped across 14 major project releases with high-speed, reliable execution",
    ],
    tags: ["C++"],
    graphSkills: ["C++"],
  },
]

/**
 * Tenure label derived from a "YYYY — YYYY|Present" range. Open-ended
 * ranges round down ("3+ yrs") so the claim is always true regardless of
 * start month.
 */
export function tenure(years: string): string {
  const [from, to] = years.split("—").map((s) => s.trim())
  const start = parseInt(from, 10)
  if (!Number.isFinite(start)) return ""
  if (/present/i.test(to)) {
    const n = Math.max(1, new Date().getFullYear() - start - 1)
    return `${n}+ yrs`
  }
  const n = Math.max(1, parseInt(to, 10) - start)
  return n === 1 ? "1 yr" : `${n} yrs`
}

/**
 * graphSkills use short display labels; skillGroups use full names. This map
 * reconciles the two so derived views (the stack graph) can join them.
 */
export const SKILL_ALIASES: Record<string, string> = {
  K8s: "Kubernetes",
}

/**
 * Canonical skill name -> role ids that used it, derived from graphSkills so
 * content stays single-sourced. Skills with no entry simply have no company
 * edge in the stack graph.
 */
// TODO(chun): Amber Road has no graphSkills, so it gets no node in the stack
// graph — add its real stack to restore it there.
export const skillUsage: Record<string, Role["id"][]> = (() => {
  const usage: Record<string, Role["id"][]> = {}
  for (const role of roles) {
    for (const s of role.graphSkills) {
      const name = SKILL_ALIASES[s] ?? s
      ;(usage[name] ??= []).push(role.id)
    }
  }
  return usage
})()

export const readouts = [
  { fig: 15, em: "+", cap: "Years Experience" },
  { fig: 3, em: "", cap: "Industries" },
  { fig: 14, em: "", cap: "Major Releases" },
]

export const skillGroups = [
  {
    title: "Languages",
    skills: ["Scala", "Java", "TypeScript", "C++", "Python"],
  },
  {
    title: "Infrastructure",
    skills: ["Docker", "Kubernetes", "CI/CD"],
  },
  {
    title: "Frameworks",
    skills: ["Akka-HTTP", "fs2", "React", "Daml"],
  },
]

export const education = [
  {
    year: "2007 — 2010",
    inst: "The Hong Kong University of Science and Technology",
    detail: "Bachelor's Degree, Computer Science",
    highlight: "· First Class Honours",
  },
  {
    year: "2009",
    inst: "University of Southampton",
    detail: "Exchange Programme, Computer Science",
    highlight: "",
  },
]

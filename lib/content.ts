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
    bullets: [
      "Drive development of mission-critical backend utilities for institutional-grade DLT",
      "Built high-performance infrastructure using Scala and Daml",
      "Built foundational distributed ledger components for the Canton Network",
      "Delivered secure, production-ready code for high-integrity systems",
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
    bullets: [
      "Designed scalable Scala and Akka-HTTP microservices for a global clinical platform",
      "Managed full-lifecycle deployments using Docker and Kubernetes",
      "Built robust backend microservices for global chatbot platforms",
      "Partnered with clinical teams to translate complex requirements into high-performance code",
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
    bullets: ["Global trade management platform engineering"],
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
    bullets: [
      "Developed core components for the Global Market Data Network using C++",
      "Contributed to 14 major project releases through high-speed, reliable execution",
    ],
    tags: ["C++"],
    graphSkills: ["C++"],
  },
]

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
  { fig: 4, em: "", cap: "Companies" },
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

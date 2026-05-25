const experiences = [
  {
    date: "2022 — Present",
    title: "Senior Software Engineer",
    company: "Digital Asset · Canton Network Utility Team",
    bullets: [
      "Drive development of mission-critical backend utilities for institutional-grade DLT",
      "Built high-performance infrastructure using Scala and Daml",
      "Built foundational distributed ledger components for the Canton Network",
      "Delivered secure, production-ready code for high-integrity systems",
    ],
    tags: ["Scala", "Daml", "DLT"],
  },
  {
    date: "2016 — 2022",
    title: "Senior Software Engineer",
    company: "Babylon Health · AI Engineering",
    bullets: [
      "Designed scalable Scala and Akka-HTTP microservices for a global clinical platform",
      "Managed full-lifecycle deployments using Docker and Kubernetes",
      "Built robust backend microservices for global chatbot platforms",
      "Partnered with clinical teams to translate complex requirements into high-performance code",
    ],
    tags: ["Scala", "Akka-HTTP", "Java", "Docker", "Kubernetes"],
  },
  {
    date: "2015 — 2016",
    title: "Senior Software Engineer",
    company: "Amber Road",
    bullets: [],
    tags: [],
  },
  {
    date: "2010 — 2014",
    title: "Software Engineer",
    company: "Thomson Reuters",
    bullets: [
      "Developed core components for the Global Market Data Network using C++",
      "Contributed to 14 major project releases through high-speed, reliable execution",
    ],
    tags: ["C++"],
  },
]

export function Experience() {
  return (
    <section className="mx-auto max-w-[800px] px-6 py-16 md:py-24">
      <div className="mb-8 h-px w-10 bg-accent-ice opacity-40" />
      <p className="mb-8 text-xs uppercase tracking-[0.25em] text-accent-ice">
        Experience
      </p>
      <div className="flex flex-col">
        {experiences.map((exp) => (
          <div
            key={exp.date}
            className="flex flex-col gap-2 border-b border-card-border py-6 last:border-b-0 md:flex-row md:gap-6"
          >
            <div className="min-w-[100px] text-xs tabular-nums text-accent-ice md:pt-1">
              {exp.date}
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-text-primary">
                {exp.title}
              </div>
              <div className="text-base font-semibold text-[#ddd]">
                {exp.company}
              </div>
              {exp.bullets.length > 0 && (
                <ul className="mt-2 list-disc pl-4 text-sm leading-[1.8] text-text-muted">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet} className="mb-1">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {exp.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-accent-border bg-accent-dim px-2 py-0.5 text-xs text-accent-ice"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

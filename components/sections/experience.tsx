const experiences = [
  {
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
  },
  {
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
  },
  {
    years: "2015 — 2016",
    title: "Senior Software Engineer",
    org: "Amber Road",
    team: "",
    bullets: [] as string[],
    tags: [] as string[],
  },
  {
    years: "2010 — 2014",
    title: "Software Engineer",
    org: "Thomson Reuters",
    team: "",
    bullets: [
      "Developed core components for the Global Market Data Network using C++",
      "Contributed to 14 major project releases through high-speed, reliable execution",
    ],
    tags: ["C++"],
  },
]

export function Experience() {
  return (
    <section className="band band--alt" id="experience" aria-labelledby="exp-label">
      <div className="wrap">
        <p className="label" id="exp-label">
          <span className="node-glyph" aria-hidden="true" />
          {"// EXPERIENCE"}
        </p>
        <div className="roles">
          {experiences.map((exp, i) => (
            <article className="role reveal" key={exp.org}>
              <div className="role__meta">
                <span className="role__years">{exp.years}</span>
                <span className="role__co">
                  node · 0x0{i + 1}
                </span>
              </div>
              <div className="role__body">
                <h3 className="role__title">{exp.title}</h3>
                <p className="role__org">{exp.org}</p>
                {exp.team && <p className="role__team">{exp.team}</p>}
                {exp.bullets.length > 0 && (
                  <ul className="role__bullets">
                    {exp.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                {exp.tags.length > 0 && (
                  <div className="role__tags" aria-label="Stack">
                    {exp.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

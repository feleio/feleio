const skillGroups = [
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

export function Skills() {
  return (
    <section className="mx-auto max-w-[800px] px-6 py-16 md:py-24">
      <div className="mb-8 h-px w-10 bg-accent-ice opacity-40" />
      <p className="mb-8 text-xs uppercase tracking-[0.25em] text-accent-ice">
        Skills
      </p>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {skillGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              {group.title}
            </h3>
            <div className="flex flex-col gap-2">
              {group.skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 text-sm text-text-secondary"
                >
                  <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-ice" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

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
    <section className="band" id="stack" aria-labelledby="stack-label">
      <div className="wrap">
        <p className="label" id="stack-label">
          <span className="node-glyph" aria-hidden="true" />
          {"// STACK"}
        </p>
        <div className="clusters">
          {skillGroups.map((group) => (
            <div className="cluster reveal" key={group.title}>
              <p className="cluster__head">
                <span className="core" aria-hidden="true" />
                {group.title}
              </p>
              <div className="cluster__nodes">
                {group.skills.map((skill) => (
                  <span className="skill-node" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

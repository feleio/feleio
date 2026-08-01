import { StackGraph } from "@/components/ui/stack-graph"
import { skillGroups } from "@/lib/content"

export function Skills() {
  return (
    <section className="band" id="stack" aria-labelledby="stack-label">
      <div className="wrap">
        <p className="label reveal" id="stack-label">
          <span className="node-glyph" aria-hidden="true" />
          {"// STACK"}
        </p>
        <StackGraph />
        {/* Chip clusters double as the canvas fallback: shown below the
            graph breakpoint, visually hidden (but AT/keyboard readable)
            above it. */}
        <div className="clusters clusters--fallback">
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

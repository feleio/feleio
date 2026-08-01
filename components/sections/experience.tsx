import type { CSSProperties } from "react"

import { roles, tenure } from "@/lib/content"

// Per-role hover glow, echoing each node's color weight in the hero graph.
const glow: Record<string, CSSProperties> = {
  da: {
    "--role-glow": "rgba(55, 224, 200, 0.45)",
    "--role-glow-soft": "rgba(55, 224, 200, 0.14)",
  } as CSSProperties,
  bh: {
    "--role-glow": "rgba(124, 140, 255, 0.5)",
    "--role-glow-soft": "rgba(124, 140, 255, 0.14)",
  } as CSSProperties,
  ar: {
    "--role-glow": "rgba(124, 140, 255, 0.32)",
    "--role-glow-soft": "rgba(124, 140, 255, 0.10)",
  } as CSSProperties,
  tr: {
    "--role-glow": "rgba(124, 140, 255, 0.5)",
    "--role-glow-soft": "rgba(124, 140, 255, 0.14)",
  } as CSSProperties,
}

export function Experience() {
  return (
    <section className="band band--alt" id="experience" aria-labelledby="exp-title">
      <div className="wrap">
        <p className="label reveal" id="exp-label">
          <span className="node-glyph" aria-hidden="true" />
          {"// EXPERIENCE"}
        </p>
        <h2 className="sec-title reveal" id="exp-title">
          Route history
        </h2>
        <div className="roles">
          {roles.map((exp) => (
            <article
              className={`role reveal${exp.compact ? " role--compact" : ""}${
                /present/i.test(exp.years) ? " role--current" : ""
              }`}
              key={exp.org}
              id={`role-${exp.id}`}
              style={glow[exp.id]}
            >
              <div className="role__meta">
                <span className="role__years">{exp.years}</span>
                <span className="role__co">{tenure(exp.years)}</span>
              </div>
              <div className="role__body">
                <h3 className="role__title">{exp.org}</h3>
                <p className="role__org">
                  {exp.title}
                  {exp.team && ` · ${exp.team}`}
                </p>
                <p className="role__scope">{exp.scope}</p>
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

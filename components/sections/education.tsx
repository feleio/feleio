const education = [
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

export function Education() {
  return (
    <section className="band band--alt" id="education" aria-labelledby="edu-label">
      <div className="wrap">
        <p className="label" id="edu-label">
          <span className="node-glyph" aria-hidden="true" />
          {"// EDUCATION"}
        </p>
        <div className="edu">
          {education.map((edu) => (
            <div className="edu__row reveal" key={edu.inst}>
              <span className="edu__year">{edu.year}</span>
              <div>
                <h3 className="edu__inst">{edu.inst}</h3>
                <p className="edu__detail">
                  {edu.detail}
                  {edu.highlight && <span className="hl"> {edu.highlight}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

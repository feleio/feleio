const readouts = [
  { fig: "15", em: "+", cap: "Years Experience" },
  { fig: "4", em: "", cap: "Industries" },
  { fig: "6", em: "", cap: "Companies" },
]

export function About() {
  return (
    <section className="band" id="profile" aria-labelledby="profile-label">
      <div className="wrap">
        <p className="label" id="profile-label">
          <span className="node-glyph" aria-hidden="true" />
          {"// PROFILE"}
        </p>
        <div className="about__grid">
          <p className="about__lede reveal">
            I am a high-execution software engineer specializing in building
            robust, high-performance systems across FinTech, HealthTech, and
            Blockchain.{" "}
            <span className="soft">
              I thrive in fast-paced environments where technical complexity
              meets the need for rapid, pragmatic delivery.
            </span>
          </p>
          <div className="readouts">
            {readouts.map((r) => (
              <div className="readout reveal" key={r.cap}>
                <span className="fig">
                  {r.fig}
                  {r.em && <em>{r.em}</em>}
                </span>
                <span className="cap">{r.cap}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

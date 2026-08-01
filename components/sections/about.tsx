import { readouts } from "@/lib/content"
import { CountUp } from "@/components/ui/count-up"

export function About() {
  return (
    <section className="band" id="profile" aria-labelledby="profile-title">
      <div className="wrap">
        <p className="label reveal" id="profile-label">
          <span className="node-glyph" aria-hidden="true" />
          {"// PROFILE"}
        </p>
        <h2 className="sec-title reveal" id="profile-title">
          Systems that can&rsquo;t afford to fail
        </h2>
        <div className="about__grid">
          <p className="about__lede reveal">
            Fifteen years of backend engineering across FinTech, HealthTech,
            and Blockchain — distributed ledgers at Digital Asset, clinical
            platforms at Babylon Health, market data at Thomson Reuters.{" "}
            <span className="soft">
              High-performance systems, delivered at the pace the business
              needs.
            </span>
          </p>
          <div className="readouts">
            {readouts.map((r) => (
              <div className="readout reveal" key={r.cap}>
                <span className="fig">
                  <CountUp value={r.fig} />
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

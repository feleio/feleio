import { TopologyGraph } from "@/components/ui/topology-graph"
import { roles } from "@/lib/content"

export function Hero() {
  return (
    <section className="hero" aria-label="Force-directed career graph">
      <TopologyGraph />
      {/* Keyboard/AT path to what mouse users get by clicking graph nodes. */}
      <nav aria-label="Jump to a role">
        {roles.map((role) => (
          <a className="hero__jump" href={`#role-${role.id}`} key={role.id}>
            {role.org} ↳
          </a>
        ))}
      </nav>
      <div className="hero__content">
        <p className="hero__eyebrow">TOPOLOGY · DISTRIBUTED BY DESIGN</p>
        <h1>
          Chun Lok
          <br />
          <span className="accent">Ling</span>
        </h1>
        <p className="hero__role">Senior Software Engineer</p>
        <p className="hero__tagline">
          <b>Distributed Systems</b>
          {" · "}AI &amp; Agentic Engineering{" · "}High-Performance FinTech
        </p>
        <p className="hero__cap">
          {"// force-directed view of a 15-year topology"}
        </p>
      </div>
      <a className="scroll-cue" href="#profile" aria-label="Scroll to profile">
        <span>SCROLL</span>
        <span className="bar" aria-hidden="true" />
      </a>
    </section>
  )
}

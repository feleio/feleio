import { GITHUB_URL, LINKEDIN_URL } from "@/lib/content"

export function Connect() {
  return (
    <section className="band" id="connect" aria-labelledby="connect-title">
      <div className="wrap">
        <p className="label reveal" id="connect-label">
          <span className="node-glyph" aria-hidden="true" />
          {"// CONNECT"}
        </p>
        <h2 className="sec-title reveal" id="connect-title">
          Open a channel
        </h2>
        <div className="connect reveal">
          <p className="connect__lede">
            <span className="prompt">$</span> open channel --to chun-lok-ling
          </p>
          <p className="connect__sub">
            Open to good conversations — distributed systems, agentic
            engineering, hard backend problems. Fastest route in is LinkedIn.
          </p>
          <div className="connect__actions">
            <a
              className="connect__cta"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
              Connect on LinkedIn
              <span className="connect__arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <a
              className="connect__alt"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/feleio ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

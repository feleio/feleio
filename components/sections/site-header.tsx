export function SiteHeader() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="brand" href="#top">
          <span className="dot" aria-hidden="true" />
          fele.io
        </a>
        <div className="status">
          <span className="legend" aria-hidden="true">
            <span>
              <i className="g g--role" />
              role
            </span>
            <span>
              <i className="g g--skill" />
              skill
            </span>
          </span>
          {/* Live count, updated by the topology graph. */}
          <span className="nodes-count">
            NODES <b id="topo-node-count">0x00</b>
          </span>
          <span className="online">
            <span className="pulse" aria-hidden="true" />
            ONLINE
          </span>
        </div>
      </div>
    </header>
  )
}

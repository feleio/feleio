import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const alt = "Chun Lok Ling — Senior Software Engineer · fele.io"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const IRIS = "#7C8CFF"
const TEAL = "#37E0C8"

// Precomputed constellation geometry — the mobile diamond from topology-graph
// mapped into the right half of the card. Edges radiate from the core.
const CORE = { x: 870, y: 306 }
const ROLES = [
  { x: 720, y: 146, label: "THOMSON REUTERS", above: true, color: IRIS },
  { x: 1020, y: 118, label: "DIGITAL ASSET", above: true, color: TEAL },
  { x: 1060, y: 400, label: "BABYLON HEALTH", above: false, color: IRIS },
  { x: 750, y: 484, label: "AMBER ROAD", above: false, color: IRIS },
]
// Satori rotates about the element center, so each edge div is centered on the
// midpoint of its core→role segment.
const EDGES = [
  { left: 685.5, top: 225.25, len: 219, deg: -133.2 },
  { left: 825, top: 211.25, len: 240, deg: -51.4 },
  { left: 859, top: 352.25, len: 212, deg: 26.3 },
  { left: 702.5, top: 394.25, len: 215, deg: 124.0 },
]

export default async function OpengraphImage() {
  const plexMono = await readFile(
    join(process.cwd(), "assets/IBMPlexMono-Medium.ttf")
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0A0B12",
          fontFamily: "IBM Plex Mono",
          position: "relative",
        }}
      >
        {/* vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(80% 90% at 72% 40%, rgba(124,140,255,0.10), rgba(10,11,18,0) 60%)",
          }}
        />

        {/* edges */}
        {EDGES.map((e, i) => (
          <div
            key={`e${i}`}
            style={{
              position: "absolute",
              left: e.left,
              top: e.top,
              width: e.len,
              height: 1.5,
              backgroundColor: "rgba(124,140,255,0.35)",
              transform: `rotate(${e.deg}deg)`,
            }}
          />
        ))}

        {/* core node */}
        <div
          style={{
            position: "absolute",
            left: CORE.x - 11,
            top: CORE.y - 11,
            width: 22,
            height: 22,
            borderRadius: "50%",
            backgroundColor: IRIS,
            boxShadow: `0 0 42px ${IRIS}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: CORE.x - 34,
            top: CORE.y + 22,
            display: "flex",
            padding: "3px 10px",
            borderRadius: 7,
            backgroundColor: "rgba(8,9,15,0.85)",
            border: "1px solid rgba(124,140,255,0.30)",
            color: "#E8EAF2",
            fontSize: 17,
          }}
        >
          fele.io
        </div>

        {/* role nodes + labels */}
        {ROLES.map((n) => (
          <div
            key={n.label}
            style={{
              position: "absolute",
              left: n.x - 8,
              top: n.y - 8,
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: n.color,
              boxShadow: `0 0 26px ${n.color}`,
            }}
          />
        ))}
        {ROLES.map((n) => (
          <div
            key={`l-${n.label}`}
            style={{
              position: "absolute",
              left: n.x - 90,
              top: n.above ? n.y - 46 : n.y + 20,
              width: 180,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "3px 9px",
                borderRadius: 7,
                backgroundColor: "rgba(8,9,15,0.85)",
                border: "1px solid rgba(35,38,58,1)",
                color: "#888EA8",
                fontSize: 14,
                letterSpacing: 1,
              }}
            >
              {n.label}
            </div>
          </div>
        ))}

        {/* copy block */}
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              color: TEAL,
              fontSize: 20,
              letterSpacing: 4,
            }}
          >
            {"TOPOLOGY · DISTRIBUTED BY DESIGN"}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 26,
              color: "#E8EAF2",
              fontSize: 76,
              lineHeight: 1.05,
            }}
          >
            <div style={{ display: "flex" }}>Chun Lok</div>
            <div style={{ display: "flex", color: IRIS }}>Ling</div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 30,
              color: "#888EA8",
              fontSize: 24,
            }}
          >
            {"// SENIOR SOFTWARE ENGINEER"}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 12,
              color: "#5A6080",
              fontSize: 19,
            }}
          >
            {"15+ years · distributed systems · fintech"}
          </div>
        </div>

        {/* bottom hairline + url */}
        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: 46,
            right: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(35,38,58,1)",
            paddingTop: 18,
            color: "#5A6080",
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex" }}>$ uptime · 15y+</div>
          <div style={{ display: "flex", color: TEAL }}>fele.io</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "IBM Plex Mono",
          data: plexMono,
          style: "normal",
          weight: 500,
        },
      ],
    }
  )
}

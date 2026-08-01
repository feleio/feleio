// Pure canvas-graph helpers shared by the hero topology graph and the
// stack cluster map. Only closure-free utilities live here — sim loops,
// layout measurement, and event wiring stay in their components.

/**
 * Narrow-screen switch for both canvas graphs. Must stay in sync with the
 * 720px media queries in globals.css (CSS vars can't drive @media, so this
 * const plus the note atop the TOPOLOGY block are the single source).
 */
export const NARROW_BP = 720

export type RGB = [number, number, number]

export const IRIS: RGB = [124, 140, 255]
export const TEAL: RGB = [55, 224, 200]
export const TEXT: RGB = [232, 234, 242]

export const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

/** Deterministic LCG so graph traffic feels steady, not jittery. */
export function createRand(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export function getMonoFamily(): string {
  return (
    getComputedStyle(document.body)
      .getPropertyValue("--font-plex-mono")
      .trim() || "ui-monospace"
  )
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/**
 * Size the canvas backing store to its CSS box at devicePixelRatio (capped
 * at 2) and normalize the context transform. Returns the CSS-pixel size.
 */
export function sizeCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): { W: number; H: number } {
  const rect = canvas.getBoundingClientRect()
  const W = rect.width
  const H = rect.height
  const DPR = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(W * DPR)
  canvas.height = Math.round(H * DPR)
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
  return { W, H }
}

/** Soft dark pill behind a label so edges never strike through the text. */
export function drawPill(
  ctx: CanvasRenderingContext2D,
  lx: number,
  ly: number,
  tw: number,
  fs: number
) {
  const pad = 7
  const h = fs + 8
  ctx.fillStyle = "rgba(8, 9, 15, 0.78)"
  ctx.beginPath()
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(lx - pad, ly - h / 2, tw + pad * 2, h, h / 2)
  } else {
    ctx.rect(lx - pad, ly - h / 2, tw + pad * 2, h)
  }
  ctx.fill()
}

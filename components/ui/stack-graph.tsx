"use client"

import { useEffect, useRef } from "react"

import { roles, skillGroups, skillUsage } from "@/lib/content"
import {
  IRIS,
  NARROW_BP,
  TEAL,
  TEXT,
  createRand,
  drawPill,
  getMonoFamily,
  prefersReducedMotion,
  rgba,
  sizeCanvas,
} from "@/lib/graph"

/**
 * The stack as a cluster map, in the hero graph's visual language: three
 * group hubs with their skills ringed around them, and the companies that
 * ran those skills docked along the bottom edge. Hovering a skill lights
 * the routes to the companies that used it; clicking a company jumps to
 * its experience card, same as the hero role nodes.
 *
 * Below NARROW_BP the sim never starts — CSS swaps in the plain chip
 * clusters instead, which also serve as the keyboard/AT representation
 * on desktop (visually hidden there, never display:none).
 */
export function StackGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !canvas.getContext) return

    const media = window.matchMedia(`(max-width: ${NARROW_BP}px)`)
    let cleanupSim: (() => void) | null = null

    const sync = () => {
      if (media.matches) {
        cleanupSim?.()
        cleanupSim = null
      } else if (!cleanupSim) {
        cleanupSim = startSim(canvas)
      }
    }
    sync()
    media.addEventListener("change", sync)
    return () => {
      media.removeEventListener("change", sync)
      cleanupSim?.()
    }
  }, [])

  return (
    <div className="stack-graph reveal">
      <canvas ref={canvasRef} className="stack-graph__canvas" aria-hidden="true" />
    </div>
  )
}

function startSim(canvas: HTMLCanvasElement): (() => void) | null {
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  const reduceMotion = prefersReducedMotion()
  const monoFamily = getMonoFamily()

  type NodeType = "hub" | "skill" | "org"
  interface GNode {
    key: string
    label: string
    type: NodeType
    x: number
    y: number
    vx: number
    vy: number
    r: number
    mass: number
    heat: number
    tx: number
    ty: number
    anchor: number
  }
  interface GEdge {
    a: GNode
    b: GNode
    t: number
    /** Usage routes (skill->org) stay faint until heated. */
    route?: boolean
  }

  const nodes: GNode[] = []
  const edges: GEdge[] = []
  const byKey: Record<string, GNode> = {}

  function addNode(key: string, label: string, type: NodeType): GNode {
    if (byKey[key]) return byKey[key]
    const n: GNode = {
      key,
      label,
      type,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: type === "hub" ? 7 : type === "org" ? 5.5 : 4,
      mass: type === "hub" ? 5 : type === "org" ? 4 : 1,
      heat: 0,
      tx: 0,
      ty: 0,
      anchor: type === "skill" ? 0.028 : 0.12,
    }
    nodes.push(n)
    byKey[key] = n
    return n
  }

  skillGroups.forEach((group) => {
    const hub = addNode("g:" + group.title, group.title, "hub")
    group.skills.forEach((s) => {
      const sn = addNode("s:" + s, s, "skill")
      edges.push({ a: hub, b: sn, t: 0 })
    })
  })

  // Companies with at least one skill route (Amber Road has none on file).
  const roleAnchor: Record<string, string> = {}
  roles.forEach((role) => {
    if (!role.graphSkills.length) return
    const on = addNode("o:" + role.id, role.org, "org")
    roleAnchor[on.key] = `role-${role.id}`
  })
  Object.entries(skillUsage).forEach(([skill, roleIds]) => {
    const sn = byKey["s:" + skill]
    if (!sn) return // graph-only skills (e.g. DLT) have no cluster node
    roleIds.forEach((id) => {
      const on = byKey["o:" + id]
      if (on) edges.push({ a: sn, b: on, t: 0, route: true })
    })
  })
  const orgs = nodes.filter((n) => n.type === "org")
  const hubs = nodes.filter((n) => n.type === "hub")

  let W = 0
  let H = 0

  function seedTargets() {
    const hubXs = [0.18, 0.5, 0.82]
    const hubY = H * 0.42
    hubs.forEach((hub, i) => {
      hub.tx = W * hubXs[i % hubXs.length]
      hub.ty = hubY
      const group = skillGroups.find((g) => "g:" + g.title === hub.key)
      if (!group) return
      const ns = group.skills.length
      const ringR = Math.min(96, W * 0.075)
      group.skills.forEach((s, j) => {
        const sn = byKey["s:" + s]
        // Fan skills across the upper arc so the lower half stays clear
        // for the routes down to the companies.
        const a = -Math.PI * 0.82 + (j / Math.max(1, ns - 1)) * Math.PI * 0.95
        sn.tx = hub.tx + Math.cos(a) * ringR
        sn.ty = hub.ty + Math.sin(a) * ringR
      })
    })
    orgs.forEach((on, i) => {
      on.tx = W * (0.5 + (i - (orgs.length - 1) / 2) * 0.27)
      on.ty = H - 46
    })
  }

  function seedPositions() {
    nodes.forEach((n) => {
      const jitter = reduceMotion ? 0 : 26
      n.x = n.tx + (Math.random() - 0.5) * jitter
      n.y = n.ty + (Math.random() - 0.5) * jitter
      n.vx = 0
      n.vy = 0
    })
  }

  function resize() {
    if (!ctx) return
    ;({ W, H } = sizeCanvas(canvas, ctx))
    seedTargets()
  }

  const mouse = { x: -9999, y: -9999 }
  let hover: GNode | null = null
  let settle = 0
  let time = 0

  interface Packet {
    e: GEdge
    t: number
    v: number
    out: boolean
  }
  const packets: Packet[] = []
  let packetClock = 0
  const rand = createRand(0.61)

  function spawnPacket() {
    if (!edges.length) return
    const e = edges[(rand() * edges.length) | 0]
    if (e.t < 1) return
    packets.push({ e, t: 0, v: 0.5 + rand() * 0.4, out: rand() > 0.4 })
  }

  function stepPackets(dt: number) {
    packetClock += dt
    if (packetClock > 900 && packets.length < 6) {
      packetClock = 0
      spawnPacket()
    }
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i]
      p.t += (dt / 1000) * p.v
      if (p.t >= 1) {
        const target = p.out ? p.e.b : p.e.a
        target.heat = Math.min(1, target.heat + 0.4)
        packets.splice(i, 1)
      }
    }
  }

  function simulate() {
    const k = 0.001
    const damping = 0.84
    const anchorBoost = settle < 1 ? 2.2 - settle : 1

    for (let ei = 0; ei < edges.length; ei++) {
      const e = edges[ei]
      if (e.route) continue // usage routes are visual, not structural
      const dx = e.b.x - e.a.x
      const dy = e.b.y - e.a.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
      const rest = 92
      const f = (dist - rest) * k
      e.a.vx += ((dx / dist) * f) / e.a.mass
      e.a.vy += ((dy / dist) * f) / e.a.mass
      e.b.vx -= ((dx / dist) * f) / e.b.mass
      e.b.vy -= ((dy / dist) * f) / e.b.mass
    }

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i]
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j]
        const ddx = a.x - b.x
        const ddy = a.y - b.y
        let d2 = ddx * ddx + ddy * ddy
        if (d2 < 1) d2 = 1
        const d = Math.sqrt(d2)
        if (d > 150) continue
        const force = 900 / d2
        a.vx += ((ddx / d) * force) / a.mass
        a.vy += ((ddy / d) * force) / a.mass
        b.vx -= ((ddx / d) * force) / b.mass
        b.vy -= ((ddy / d) * force) / b.mass
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]
      n.vx += (n.tx - n.x) * n.anchor * anchorBoost
      n.vy += (n.ty - n.y) * n.anchor * anchorBoost

      if (settle >= 1 && !reduceMotion && n.type === "skill") {
        n.vx += Math.cos(time * 0.55 + n.tx * 0.02) * 0.04
        n.vy += Math.sin(time * 0.5 + n.ty * 0.02) * 0.04
      }

      n.heat *= 0.94
      n.vx *= damping
      n.vy *= damping
      n.x += n.vx
      n.y += n.vy

      const pad = 30
      if (n.x < pad) n.x = pad
      if (n.x > W - pad) n.x = W - pad
      if (n.y < 26) n.y = 26
      if (n.y > H - 24) n.y = H - 24
    }
  }

  /** Heat a skill's usage routes (and their orgs), or an org's routes. */
  function heatRoutes(n: GNode) {
    for (const e of edges) {
      if (!e.route) continue
      if (e.a === n || e.b === n) {
        e.a.heat = Math.max(e.a.heat, 0.5)
        e.b.heat = Math.max(e.b.heat, 0.5)
      }
    }
  }

  function drawDiamond(x: number, y: number, r: number) {
    ctx!.beginPath()
    ctx!.moveTo(x, y - r)
    ctx!.lineTo(x + r, y)
    ctx!.lineTo(x, y + r)
    ctx!.lineTo(x - r, y)
    ctx!.closePath()
  }

  function draw() {
    if (!ctx) return
    ctx.clearRect(0, 0, W, H)

    for (let ei = 0; ei < edges.length; ei++) {
      const e = edges[ei]
      e.t = Math.min(1, e.t + 0.02)
      const prog = reduceMotion ? 1 : e.t
      const bx = e.a.x + (e.b.x - e.a.x) * prog
      const by = e.a.y + (e.b.y - e.a.y) * prog

      const heat = Math.max(e.a.heat, e.b.heat)
      const lit = heat > 0.08
      const col = e.route
        ? lit
          ? rgba(TEAL, 0.12 + heat * 0.55)
          : rgba(IRIS, 0.09)
        : lit
          ? rgba(TEAL, 0.16 + heat * 0.4)
          : rgba(IRIS, 0.16)

      ctx.beginPath()
      ctx.moveTo(e.a.x, e.a.y)
      ctx.lineTo(bx, by)
      ctx.strokeStyle = col
      ctx.lineWidth = e.route ? 0.9 : 1
      if (e.route && heat > 0.25) {
        ctx.shadowColor = rgba(TEAL, 0.5)
        ctx.shadowBlur = 6
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // Packets ride any edge; keep them subtle.
    for (let i = 0; i < packets.length; i++) {
      const p = packets[i]
      const from = p.out ? p.e.a : p.e.b
      const to = p.out ? p.e.b : p.e.a
      const x = from.x + (to.x - from.x) * p.t
      const y = from.y + (to.y - from.y) * p.t
      const fade = Math.min(1, p.t * 6, (1 - p.t) * 6)
      ctx.beginPath()
      ctx.arc(x, y, 1.6, 0, Math.PI * 2)
      ctx.fillStyle = rgba(TEAL, 0.85 * fade)
      ctx.shadowColor = rgba(TEAL, 0.7)
      ctx.shadowBlur = 6
      ctx.fill()
      ctx.shadowBlur = 0
    }

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]
      const heat = n.heat
      const isHub = n.type === "hub"
      const isOrg = n.type === "org"
      const baseCol = isOrg ? TEAL : IRIS
      const col = heat > 0.06 ? TEAL : baseCol

      // Idle pulse rings advertise that company nodes are interactive.
      if (!reduceMotion && settle >= 1 && isOrg) {
        const ph = ((time + i * 1.1) % 4.6) / 4.6
        if (ph < 0.4) {
          const t = ph / 0.4
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.r + t * n.r * 2.4, 0, Math.PI * 2)
          ctx.strokeStyle = rgba(TEAL, (1 - t) * 0.22)
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      if (hover === n && isOrg) {
        ctx.beginPath()
        ctx.setLineDash([3, 4])
        ctx.lineDashOffset = -time * 12
        ctx.arc(n.x, n.y, n.r + 7, 0, Math.PI * 2)
        ctx.strokeStyle = rgba(TEAL, 0.85)
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.setLineDash([])
      }

      const haloA = isHub ? 0.14 + heat * 0.3 : heat * 0.45
      if (haloA > 0.01) {
        const hr = n.r * 3.4
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, hr)
        grd.addColorStop(0, rgba(col, haloA))
        grd.addColorStop(1, rgba(col, 0))
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(n.x, n.y, hr, 0, Math.PI * 2)
        ctx.fill()
      }

      if (isOrg) {
        drawDiamond(n.x, n.y, n.r + 1.5)
        ctx.strokeStyle = rgba(col, 0.95)
        ctx.lineWidth = 1.4
        ctx.fillStyle = rgba([10, 11, 18], 0.92)
        ctx.fill()
        ctx.stroke()
      } else if (isHub) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = rgba(col, 0.95)
        ctx.shadowColor = rgba(col, 0.65)
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      } else {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.strokeStyle = rgba(col, 0.9)
        ctx.lineWidth = 1.5
        ctx.fillStyle = rgba([10, 11, 18], 0.9)
        ctx.fill()
        ctx.stroke()
      }

      const fontSize = isHub ? 12 : isOrg ? 12 : 11
      ctx.font = `${isHub ? "600" : "500"} ${fontSize}px ${monoFamily}, monospace`
      ctx.textBaseline = "middle"
      ctx.textAlign = "left"
      const label = isHub ? n.label.toUpperCase() : n.label
      const tw = ctx.measureText(label).width
      let lx: number
      let ly: number
      if (isHub) {
        lx = n.x - tw / 2
        ly = n.y - n.r - 16
      } else if (isOrg) {
        lx = Math.min(Math.max(n.x - tw / 2, 8), W - tw - 8)
        ly = n.y + n.r + 16
      } else {
        const gap = n.r + 8
        lx = n.x + gap + tw > W - 10 ? Math.max(6, n.x - gap - tw) : n.x + gap
        ly = n.y
      }
      drawPill(ctx, lx, ly, tw, fontSize)
      const hovered = hover === n
      const labelA = isHub ? 0.6 : isOrg ? 0.8 : 0.72
      ctx.fillStyle = hovered
        ? rgba(TEXT, 1)
        : heat > 0.1
          ? rgba(TEAL, Math.min(1, 0.55 + heat))
          : rgba(TEXT, labelA)
      ctx.fillText(label, lx, ly)
      if (hovered && isOrg) {
        ctx.beginPath()
        ctx.moveTo(lx, ly + fontSize / 2 + 3)
        ctx.lineTo(lx + tw, ly + fontSize / 2 + 3)
        ctx.strokeStyle = rgba(TEAL, 0.7)
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.font = `500 10px ${monoFamily}, monospace`
        ctx.fillStyle = rgba(TEAL, 0.75)
        ctx.fillText("↳ view role", lx, ly + fontSize / 2 + 15)
      }
    }
  }

  function hitNode(x: number, y: number): GNode | null {
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]
      const dx = n.x - x
      const dy = n.y - y
      if (dx * dx + dy * dy < 16 * 16) return n
    }
    return null
  }

  const onMouseMove = (ev: MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    mouse.x = ev.clientX - rect.left
    mouse.y = ev.clientY - rect.top
    hover = hitNode(mouse.x, mouse.y)
    if (hover) {
      hover.heat = Math.min(1, hover.heat + 0.2)
      if (hover.type !== "hub") heatRoutes(hover)
    }
    canvas.style.cursor = hover?.type === "org" ? "pointer" : ""
  }
  const onMouseLeave = () => {
    hover = null
    mouse.x = -9999
    mouse.y = -9999
  }
  const onClick = () => {
    if (!hover || hover.type !== "org") return
    hover.heat = 1
    const target = document.getElementById(roleAnchor[hover.key] ?? "")
    if (target) {
      const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth"
      target.scrollIntoView({ behavior, block: "center" })
      target.classList.remove("is-target")
      // Restart the highlight animation even on repeat clicks.
      void (target as HTMLElement).offsetWidth
      target.classList.add("is-target")
    }
  }
  canvas.addEventListener("click", onClick)
  canvas.addEventListener("mousemove", onMouseMove)
  canvas.addEventListener("mouseleave", onMouseLeave)

  let raf = 0
  let last = performance.now()
  function frame(now: number) {
    const dt = Math.min(40, now - last)
    last = now
    time += dt / 1000
    if (settle < 1) settle = Math.min(1, settle + dt / 1100)
    if (settle >= 1) stepPackets(dt)
    simulate()
    draw()
    raf = requestAnimationFrame(frame)
  }

  function renderStill() {
    settle = 1
    nodes.forEach((n) => {
      n.x = n.tx
      n.y = n.ty
    })
    for (let s = 0; s < 60; s++) simulate()
    edges.forEach((e) => {
      e.t = 1
    })
    draw()
  }

  const onResize = () => {
    resize()
    if (reduceMotion) renderStill()
  }

  resize()
  seedPositions()
  window.addEventListener("resize", onResize)
  document.fonts?.ready.then(() => onResize()).catch(() => {})

  // Same discipline as the hero: no sim while the section is off screen.
  let visObserver: IntersectionObserver | null = null
  if (reduceMotion) {
    renderStill()
  } else {
    const start = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      if (!raf) return
      cancelAnimationFrame(raf)
      raf = 0
    }
    visObserver = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) start()
      else stop()
    })
    visObserver.observe(canvas)
  }

  return () => {
    cancelAnimationFrame(raf)
    visObserver?.disconnect()
    window.removeEventListener("resize", onResize)
    canvas.removeEventListener("click", onClick)
    canvas.removeEventListener("mousemove", onMouseMove)
    canvas.removeEventListener("mouseleave", onMouseLeave)
  }
}

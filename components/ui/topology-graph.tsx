"use client"

import { useEffect, useRef } from "react"

import { roles } from "@/lib/content"
import {
  IRIS,
  NARROW_BP,
  TEAL,
  TEXT,
  createRand,
  drawPill as drawPillBase,
  getMonoFamily,
  prefersReducedMotion,
  rgba,
  sizeCanvas,
} from "@/lib/graph"

/**
 * The signature: a force-directed view of a 15-year career.
 * A real spring/charge simulation — a central fele.io core, role nodes, and
 * skill nodes, with edges encoding which skills belong to which role. Fly-in
 * settle on load, edges illuminate, the core pulses once, gentle drift, and
 * the cursor (or touch) repels nearby nodes and lights their edges teal.
 *
 * On narrow screens the graph is confined to its own band BELOW the hero text
 * and role labels stay visible, so it reads as an intentional constellation
 * rather than scattered dots over the headline.
 *
 * Once settled, packets travel the edges as live traffic; a packet arriving at
 * a node heats it, briefly lighting its label and edges teal. Role nodes are
 * clickable and jump to the matching experience card.
 */
export function TopologyGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !canvas.getContext) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion = prefersReducedMotion()
    const monoFamily = getMonoFamily()

    type NodeType = "core" | "role" | "skill"
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
      placed?: boolean
      side?: number // narrow-screen label position: -1 above, 1 below
    }
    interface GEdge {
      a: GNode
      b: GNode
      t: number
    }

    const model = {
      roles: roles.map((r) => ({
        id: r.graphId,
        label: r.org,
        skills: r.graphSkills,
      })),
    }
    const roleAnchor: Record<string, string> = Object.fromEntries(
      roles.map((r) => [r.graphId, `role-${r.id}`])
    )

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
        r: type === "core" ? 9 : type === "role" ? 6.5 : 4,
        mass: type === "core" ? 6 : type === "role" ? 3 : 1,
        heat: 0,
        tx: 0,
        ty: 0,
      }
      nodes.push(n)
      byKey[key] = n
      return n
    }

    const core = addNode("fele.io", "fele.io", "core")
    model.roles.forEach((role) => {
      const rn = addNode(role.id, role.label, "role")
      edges.push({ a: core, b: rn, t: 0 })
      role.skills.forEach((s) => {
        const sn = addNode("s:" + s, s, "skill")
        edges.push({ a: rn, b: sn, t: 0 })
      })
    })

    let W = 0
    let H = 0
    let cx = 0
    let cy = 0
    let layoutScale = 1
    let narrow = false
    let hideSkills = false
    let boundsTop = 86
    let boundsBot = 0
    const hidden = (n: GNode) => hideSkills && n.type === "skill"

    function resize() {
      if (!canvas || !ctx) return
      ;({ W, H } = sizeCanvas(canvas, ctx))

      narrow = W <= NARROW_BP
      if (narrow) {
        // Confine the graph to a band beneath the hero copy. The copy's real
        // bottom edge sets the top bound — a fixed fraction breaks whenever
        // font sizes or phone aspect ratios push the text lower.
        let top = H * 0.46
        const content = document.querySelector(".hero__content")
        if (content) {
          const cr = content.getBoundingClientRect()
          const kr = canvas.getBoundingClientRect()
          top = Math.max(top, cr.bottom - kr.top + 14)
        }
        boundsTop = Math.min(top, H - 200)
        boundsBot = H - 30
        cx = W * 0.5
        cy = (boundsTop + boundsBot) / 2
        const bandH = boundsBot - boundsTop
        layoutScale = Math.max(
          0.42,
          Math.min(0.82, Math.min(W / 620, bandH / 460))
        )
        hideSkills = true
      } else {
        boundsTop = 86
        boundsBot = H - 34
        cx = W * 0.66
        cy = H * 0.55
        layoutScale = Math.max(0.62, Math.min(1.15, W / 1180))
        hideSkills = false
      }
      seedTargets()
    }

    function seedTargets() {
      nodes.forEach((n) => {
        n.placed = false
        n.side = undefined
      })

      if (narrow) {
        // Composed constellation: core + roles hand-placed in an open diamond
        // across the whole band. Labels stack above/below their node, so
        // nothing depends on sideways space the phone doesn't have.
        const padX = 30
        const bx = (f: number) => padX + f * (W - padX * 2)
        const by = (f: number) =>
          boundsTop + 26 + f * (boundsBot - 24 - (boundsTop + 26))
        core.tx = bx(0.46)
        core.ty = by(0.48)
        const spots: Record<string, [number, number, number]> = {
          TR: [0.16, 0.14, -1],
          DA: [0.76, 0.08, -1],
          BH: [0.84, 0.68, 1],
          AR: [0.22, 0.86, 1],
        }
        model.roles.forEach((role) => {
          const rn = byKey[role.id]
          const [fx, fy, side] = spots[role.id]
          rn.tx = bx(fx)
          rn.ty = by(fy)
          rn.side = side
        })
        return
      }

      core.tx = cx
      core.ty = cy
      const roleR = 150 * layoutScale
      const skillR = 120 * layoutScale
      const nRoles = model.roles.length
      model.roles.forEach((role, i) => {
        const ang = -Math.PI / 2 + (i / nRoles) * Math.PI * 2 + 0.35
        const rn = byKey[role.id]
        rn.tx = cx + Math.cos(ang) * roleR
        rn.ty = cy + Math.sin(ang) * roleR
        const ns = role.skills.length
        role.skills.forEach((s, j) => {
          const sn = byKey["s:" + s]
          const spread = 0.95
          const a2 = ang + (ns > 1 ? j / (ns - 1) - 0.5 : 0) * spread
          if (sn.placed) return
          sn.tx = rn.tx + Math.cos(a2) * skillR
          sn.ty = rn.ty + Math.sin(a2) * skillR
          sn.placed = true
        })
      })
    }

    function seedPositions() {
      nodes.forEach((n) => {
        if (n.type === "core") {
          n.x = cx
          n.y = cy
        } else {
          const a = Math.random() * Math.PI * 2
          const d = reduceMotion ? 0 : 20 + Math.random() * 40
          n.x = cx + Math.cos(a) * d
          n.y = cy + Math.sin(a) * d
        }
        n.vx = 0
        n.vy = 0
      })
    }

    const mouse = { x: -9999, y: -9999, active: false }
    let hover: GNode | null = null
    let settle = 0
    let corePulse = 0
    let corePulseFired = false
    let time = 0

    // Live traffic: packets travel edges, heat whatever node they arrive at.
    interface Packet {
      e: GEdge
      t: number
      v: number
      out: boolean
    }
    const packets: Packet[] = []
    let packetClock = 0
    const rand = createRand(0.37)

    function spawnPacket() {
      const pool = hideSkills
        ? edges.filter((e) => !hidden(e.a) && !hidden(e.b))
        : edges
      if (!pool.length) return
      const e = pool[(rand() * pool.length) | 0]
      if (e.t < 1) return
      packets.push({
        e,
        t: 0,
        v: 0.55 + rand() * 0.5,
        out: rand() > 0.3,
      })
    }

    function stepPackets(dt: number) {
      packetClock += dt
      if (packetClock > 640 && packets.length < 14) {
        packetClock = 0
        spawnPacket()
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        p.t += (dt / 1000) * p.v
        if (p.t >= 1) {
          const target = p.out ? p.e.b : p.e.a
          target.heat = Math.min(1, target.heat + 0.5)
          packets.splice(i, 1)
        }
      }
    }

    function drawPackets() {
      if (!ctx) return
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i]
        const from = p.out ? p.e.a : p.e.b
        const to = p.out ? p.e.b : p.e.a
        const x = from.x + (to.x - from.x) * p.t
        const y = from.y + (to.y - from.y) * p.t
        // Short trailing comet behind the packet.
        const tt = Math.max(0, p.t - 0.12)
        const tx2 = from.x + (to.x - from.x) * tt
        const ty2 = from.y + (to.y - from.y) * tt
        const fade = Math.min(1, p.t * 6, (1 - p.t) * 6)
        const grad = ctx.createLinearGradient(tx2, ty2, x, y)
        grad.addColorStop(0, rgba(TEAL, 0))
        grad.addColorStop(1, rgba(TEAL, 0.55 * fade))
        ctx.beginPath()
        ctx.moveTo(tx2, ty2)
        ctx.lineTo(x, y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.4
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(x, y, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = rgba(TEAL, 0.95 * fade)
        ctx.shadowColor = rgba(TEAL, 0.8)
        ctx.shadowBlur = 7
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    function simulate() {
      const k = 0.0009
      const charge = 1700 * layoutScale * layoutScale
      const damping = 0.86
      const anchorPull = settle < 1 ? 0.06 * (1 - settle) + 0.02 : 0.022

      for (let ei = 0; ei < edges.length; ei++) {
        const e = edges[ei]
        if (hidden(e.a) || hidden(e.b)) continue
        const dx = e.b.x - e.a.x
        const dy = e.b.y - e.a.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
        const rest = (e.a.type === "core" ? 150 : 118) * layoutScale
        const f = (dist - rest) * k
        const fx = (dx / dist) * f
        const fy = (dy / dist) * f
        e.a.vx += fx / e.a.mass
        e.a.vy += fy / e.a.mass
        e.b.vx -= fx / e.b.mass
        e.b.vy -= fy / e.b.mass
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        if (hidden(a)) continue
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          if (hidden(b)) continue
          const ddx = a.x - b.x
          const ddy = a.y - b.y
          let d2 = ddx * ddx + ddy * ddy
          if (d2 < 1) d2 = 1
          const d = Math.sqrt(d2)
          if (d > 280) continue
          const force = charge / d2
          const ux = ddx / d
          const uy = ddy / d
          a.vx += (ux * force) / a.mass
          a.vy += (uy * force) / a.mass
          b.vx -= (ux * force) / b.mass
          b.vy -= (uy * force) / b.mass
        }
      }

      for (let n2 = 0; n2 < nodes.length; n2++) {
        const nd = nodes[n2]
        if (hidden(nd)) continue
        nd.vx += (nd.tx - nd.x) * anchorPull
        nd.vy += (nd.ty - nd.y) * anchorPull

        if (settle >= 1 && !reduceMotion && nd.type !== "core") {
          const drift = narrow ? 0.03 : 0.06
          nd.vx += Math.cos(time * 0.6 + nd.x * 0.01) * drift
          nd.vy += Math.sin(time * 0.5 + nd.y * 0.01) * drift
        }

        if (mouse.active) {
          const mdx = nd.x - mouse.x
          const mdy = nd.y - mouse.y
          const md2 = mdx * mdx + mdy * mdy
          const radius = 140
          if (md2 < radius * radius) {
            const md = Math.sqrt(md2) || 0.01
            const push = 1 - md / radius
            nd.vx += (mdx / md) * push * 2.6
            nd.vy += (mdy / md) * push * 2.6
            nd.heat = Math.min(1, nd.heat + push * 0.16)
          }
        }
        nd.heat *= 0.94

        nd.vx *= damping
        nd.vy *= damping
        if (nd.type === "core" && settle < 1) {
          nd.vx *= 0.5
          nd.vy *= 0.5
        }
        nd.x += nd.vx
        nd.y += nd.vy

        const padX = 36
        if (nd.x < padX) {
          nd.x = padX
          nd.vx *= -0.35
        }
        if (nd.x > W - padX) {
          nd.x = W - padX
          nd.vx *= -0.35
        }
        if (nd.y < boundsTop) {
          nd.y = boundsTop
          nd.vy = Math.abs(nd.vy) * 0.3
        }
        if (nd.y > boundsBot) {
          nd.y = boundsBot
          nd.vy *= -0.35
        }
      }
    }

    const countEl = document.getElementById("topo-node-count")
    let lastCountFrame = -1

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, W, H)

      for (let ei = 0; ei < edges.length; ei++) {
        const e = edges[ei]
        if (hidden(e.a) || hidden(e.b)) continue
        e.t = Math.min(1, e.t + 0.02)
        const prog = reduceMotion ? 1 : e.t
        const ax = e.a.x
        const ay = e.a.y
        const bx = e.a.x + (e.b.x - e.a.x) * prog
        const by = e.a.y + (e.b.y - e.a.y) * prog

        const heat = Math.max(e.a.heat, e.b.heat)
        const baseA = e.a.type === "core" ? 0.22 : 0.12
        const col =
          heat > 0.04 ? rgba(TEAL, baseA + heat * 0.55) : rgba(IRIS, baseA + 0.04)

        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(bx, by)
        ctx.strokeStyle = col
        ctx.lineWidth = e.a.type === "core" ? 1.1 : 0.8
        if (heat > 0.2) {
          ctx.shadowColor = rgba(TEAL, 0.6)
          ctx.shadowBlur = 8
        }
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      drawPackets()

      const drawPill = (lx: number, ly: number, tw: number, fs: number) =>
        drawPillBase(ctx, lx, ly, tw, fs)

      const showSkillLabels = W > 560
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        if (hidden(n)) continue
        const heat = n.heat
        const isCore = n.type === "core"
        const baseCol = isCore ? IRIS : n.type === "role" ? IRIS : TEAL
        const col = heat > 0.04 ? TEAL : baseCol

        const pulse = isCore ? 1 + corePulse * 0.6 : 1

        // Idle pulse rings advertise that role nodes are interactive.
        if (!reduceMotion && settle >= 1 && n.type === "role") {
          const ph = ((time + i * 0.9) % 4.2) / 4.2
          if (ph < 0.45) {
            const t = ph / 0.45
            ctx.beginPath()
            ctx.arc(n.x, n.y, n.r + t * n.r * 2.6, 0, Math.PI * 2)
            ctx.strokeStyle = rgba(IRIS, (1 - t) * 0.28)
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }

        // Hover affordance: dashed ring slowly orbiting the hovered node.
        if (hover === n) {
          ctx.beginPath()
          ctx.setLineDash([3, 4])
          ctx.lineDashOffset = -time * 12
          ctx.arc(n.x, n.y, n.r * pulse + 7, 0, Math.PI * 2)
          ctx.strokeStyle = rgba(TEAL, 0.85)
          ctx.lineWidth = 1
          ctx.stroke()
          ctx.setLineDash([])
        }

        const haloA = isCore ? 0.2 + corePulse * 0.4 : heat * 0.5
        if (haloA > 0.01) {
          const hr = n.r * (isCore ? 4.5 : 3.2) * pulse
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, hr)
          grd.addColorStop(0, rgba(col, haloA))
          grd.addColorStop(1, rgba(col, 0))
          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.arc(n.x, n.y, hr, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2)
        if (n.type === "skill") {
          ctx.strokeStyle = rgba(col, 0.9)
          ctx.lineWidth = 1.6
          ctx.fillStyle = rgba([10, 11, 18], 0.9)
          ctx.fill()
          ctx.stroke()
        } else {
          ctx.fillStyle = rgba(col, isCore ? 1 : 0.95)
          ctx.shadowColor = rgba(col, 0.7)
          ctx.shadowBlur = isCore ? 16 : 8
          ctx.fill()
          ctx.shadowBlur = 0
        }

        // Core + role labels always render (they carry the meaning); skill
        // labels only on wide screens or when lit. Labels flip to the left of
        // the node when they'd run off the right edge — key on mobile.
        const labelThis =
          isCore || n.type === "role" || (showSkillLabels && heat > 0.15)
        if (labelThis) {
          const fontSize = isCore ? 13 : n.type === "role" ? 12 : 11
          ctx.font = `${isCore ? "600" : "500"} ${fontSize}px ${monoFamily}, monospace`
          const labelA = isCore
            ? 0.95
            : n.type === "role"
              ? 0.78
              : Math.min(0.9, 0.3 + heat)
          ctx.textBaseline = "middle"
          const tw = ctx.measureText(n.label).width
          let lx: number
          let ly: number
          if (narrow && !isCore && n.side) {
            // Stacked label, centered on the node, clamped to the viewport.
            lx = Math.min(Math.max(n.x - tw / 2, 8), W - tw - 8)
            ly = n.y + n.side * (n.r * pulse + 16)
          } else {
            const gap = n.r * pulse + 8
            lx =
              n.x + gap + tw > W - 12
                ? Math.max(6, n.x - gap - tw) // flip left of the node
                : n.x + gap
            ly = n.y
          }
          drawPill(lx, ly, tw, fontSize)
          const hovered = hover === n
          ctx.fillStyle = hovered
            ? rgba(TEXT, 1)
            : heat > 0.1
              ? rgba(TEAL, Math.min(1, 0.55 + heat))
              : rgba(TEXT, labelA)
          ctx.textAlign = "left"
          ctx.fillText(n.label, lx, ly)
          if (hovered) {
            // Underline + a small hint so the click affordance is explicit.
            ctx.beginPath()
            ctx.moveTo(lx, ly + fontSize / 2 + 3)
            ctx.lineTo(lx + tw, ly + fontSize / 2 + 3)
            ctx.strokeStyle = rgba(TEAL, 0.7)
            ctx.lineWidth = 1
            ctx.stroke()
            const hint = isCore ? "↳ top" : "↳ view role"
            ctx.font = `500 10px ${monoFamily}, monospace`
            ctx.fillStyle = rgba(TEAL, 0.75)
            ctx.fillText(hint, lx, ly + fontSize / 2 + 15)
          }
        }
      }

      if (countEl && (time | 0) !== lastCountFrame) {
        lastCountFrame = time | 0
        const vis = nodes.filter((n) => !hidden(n))
        const lit = vis.filter((n) => n.heat > 0.05).length
        const hex = vis.length.toString(16).toUpperCase().padStart(2, "0")
        countEl.innerHTML = "0x" + hex + (lit ? " <b>·" + lit + " hot</b>" : "")
      }
    }

    function hitNode(x: number, y: number): GNode | null {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        if (n.type === "skill") continue
        const dx = n.x - x
        const dy = n.y - y
        if (dx * dx + dy * dy < 18 * 18) return n
      }
      return null
    }

    // Pointer listeners live on the hero section, not the canvas, so the
    // overlaying copy stays selectable (no pointer-events:none hack) while
    // repulsion and node clicks keep working across the whole hero.
    const heroEl = (canvas.closest(".hero") as HTMLElement | null) ?? canvas

    function onMove(clientX: number, clientY: number) {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      mouse.x = clientX - rect.left
      mouse.y = clientY - rect.top
      mouse.active = true
      heroEl.style.cursor = hitNode(mouse.x, mouse.y) ? "pointer" : ""
    }
    const onClick = (ev: MouseEvent) => {
      if (!canvas) return
      // Real links in the hero (scroll cue etc.) win over node hits.
      if (ev.target instanceof Element && ev.target.closest("a")) return
      const rect = canvas.getBoundingClientRect()
      const n = hitNode(ev.clientX - rect.left, ev.clientY - rect.top)
      if (!n) return
      n.heat = 1
      const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth"
      if (n.type === "core") {
        window.scrollTo({ top: 0, behavior })
        return
      }
      const target = document.getElementById(roleAnchor[n.key] ?? "")
      if (target) {
        target.scrollIntoView({ behavior, block: "center" })
        target.classList.remove("is-target")
        // Restart the highlight animation even on repeat clicks.
        void (target as HTMLElement).offsetWidth
        target.classList.add("is-target")
      }
    }
    const onMouseMove = (ev: MouseEvent) => {
      onMove(ev.clientX, ev.clientY)
      hover = hitNode(mouse.x, mouse.y)
    }
    const onMouseLeave = () => {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
      hover = null
    }
    const onTouchMove = (ev: TouchEvent) => {
      if (ev.touches[0]) onMove(ev.touches[0].clientX, ev.touches[0].clientY)
    }
    const onTouchEnd = () => {
      mouse.active = false
    }
    heroEl.addEventListener("click", onClick)
    if (!reduceMotion) {
      heroEl.addEventListener("mousemove", onMouseMove)
      heroEl.addEventListener("mouseleave", onMouseLeave)
      heroEl.addEventListener("touchmove", onTouchMove, { passive: true })
      heroEl.addEventListener("touchend", onTouchEnd)
    }

    let raf = 0
    let last = performance.now()
    function frame(now: number) {
      const dt = Math.min(40, now - last)
      last = now
      time += dt / 1000
      if (settle < 1) settle = Math.min(1, settle + dt / 1400)
      if (settle > 0.55 && corePulse === 0 && !corePulseFired) {
        corePulse = 1
        corePulseFired = true
      }
      if (corePulse > 0) corePulse = Math.max(0, corePulse - dt / 700)
      if (settle >= 1) stepPackets(dt)
      const steps = settle < 1 ? 2 : 1
      for (let s = 0; s < steps; s++) simulate()
      draw()
      raf = requestAnimationFrame(frame)
    }

    function renderStill() {
      settle = 1
      corePulse = 0
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
      const px = nodes.map((n) => ({ x: n.x, y: n.y }))
      resize()
      nodes.forEach((n, i) => {
        n.x = px[i] ? px[i].x : n.x
        n.y = px[i] ? px[i].y : n.y
      })
    }

    resize()
    seedPositions()
    window.addEventListener("resize", onResize)
    // The hero copy reflows when webfonts swap in; re-measure the band then.
    document.fonts?.ready.then(() => onResize()).catch(() => {})

    // The O(n²) sim has no business running once the hero is off screen —
    // the observer stops the loop on exit and resumes it seamlessly on entry
    // (resetting `last` first so the resume frame doesn't get a huge dt).
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
      heroEl.removeEventListener("click", onClick)
      heroEl.removeEventListener("mousemove", onMouseMove)
      heroEl.removeEventListener("mouseleave", onMouseLeave)
      heroEl.removeEventListener("touchmove", onTouchMove)
      heroEl.removeEventListener("touchend", onTouchEnd)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
}

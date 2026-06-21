"use client"

import { useEffect, useRef } from "react"

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
 */
export function TopologyGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !canvas.getContext) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const IRIS: [number, number, number] = [124, 140, 255]
    const TEAL: [number, number, number] = [55, 224, 200]
    const TEXT: [number, number, number] = [232, 234, 242]
    const rgba = (c: [number, number, number], a: number) =>
      `rgba(${c[0]},${c[1]},${c[2]},${a})`

    const monoFamily =
      getComputedStyle(document.body)
        .getPropertyValue("--font-plex-mono")
        .trim() || "ui-monospace"

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
    }
    interface GEdge {
      a: GNode
      b: GNode
      t: number
    }

    const model = {
      roles: [
        { id: "DA", label: "Digital Asset", skills: ["Scala", "Daml", "DLT"] },
        {
          id: "BH",
          label: "Babylon Health",
          skills: ["Scala", "Akka-HTTP", "Java", "Docker", "K8s"],
        },
        { id: "AR", label: "Amber Road", skills: [] as string[] },
        { id: "TR", label: "Thomson Reuters", skills: ["C++"] },
      ],
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
    let DPR = 1
    let cx = 0
    let cy = 0
    let layoutScale = 1
    let narrow = false
    let boundsTop = 86
    let boundsBot = 0

    function resize() {
      if (!canvas || !ctx) return
      const rect = canvas.getBoundingClientRect()
      W = rect.width
      H = rect.height
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

      narrow = W <= 720
      if (narrow) {
        // Confine the graph to a band beneath the headline.
        boundsTop = H * 0.46
        boundsBot = H - 38
        cx = W * 0.5
        cy = (boundsTop + boundsBot) / 2
        layoutScale = Math.max(0.5, Math.min(0.82, W / 620))
      } else {
        boundsTop = 86
        boundsBot = H - 34
        cx = W * 0.66
        cy = H * 0.55
        layoutScale = Math.max(0.62, Math.min(1.15, W / 1180))
      }
      seedTargets()
    }

    function seedTargets() {
      core.tx = cx
      core.ty = cy
      const roleR = (narrow ? 118 : 150) * layoutScale
      const skillR = (narrow ? 96 : 120) * layoutScale
      const nRoles = model.roles.length
      nodes.forEach((n) => {
        n.placed = false
      })
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
      // Squash horizontally on mobile so labels have room before the edges.
      if (narrow) {
        nodes.forEach((n) => {
          n.tx = cx + (n.tx - cx) * 0.8
        })
      }
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
    let settle = 0
    let corePulse = 0
    let corePulseFired = false
    let time = 0

    function simulate() {
      const k = 0.0009
      const charge = 1700 * layoutScale * layoutScale
      const damping = 0.86
      const anchorPull = settle < 1 ? 0.06 * (1 - settle) + 0.02 : 0.022

      for (let ei = 0; ei < edges.length; ei++) {
        const e = edges[ei]
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
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
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

      const showSkillLabels = W > 560
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const heat = n.heat
        const isCore = n.type === "core"
        const baseCol = isCore ? IRIS : n.type === "role" ? IRIS : TEAL
        const col = heat > 0.04 ? TEAL : baseCol

        const pulse = isCore ? 1 + corePulse * 0.6 : 1
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
          ctx.fillStyle =
            heat > 0.1
              ? rgba(TEAL, Math.min(1, 0.55 + heat))
              : rgba(TEXT, labelA)
          ctx.textBaseline = "middle"
          const gap = n.r * pulse + 8
          const tw = ctx.measureText(n.label).width
          if (n.x + gap + tw > W - 12) {
            // Flip to the left of the node, clamped so it never runs off-screen.
            ctx.textAlign = "right"
            ctx.fillText(n.label, Math.max(tw + 6, n.x - gap), n.y)
          } else {
            ctx.textAlign = "left"
            ctx.fillText(n.label, n.x + gap, n.y)
          }
        }
      }

      if (countEl && (time | 0) !== lastCountFrame) {
        lastCountFrame = time | 0
        const lit = nodes.filter((n) => n.heat > 0.05).length
        const hex = nodes.length.toString(16).toUpperCase().padStart(2, "0")
        countEl.innerHTML = "0x" + hex + (lit ? " <b>·" + lit + " hot</b>" : "")
      }
    }

    function onMove(clientX: number, clientY: number) {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      mouse.x = clientX - rect.left
      mouse.y = clientY - rect.top
      mouse.active = true
    }
    const onMouseMove = (ev: MouseEvent) => onMove(ev.clientX, ev.clientY)
    const onMouseLeave = () => {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }
    const onTouchMove = (ev: TouchEvent) => {
      if (ev.touches[0]) onMove(ev.touches[0].clientX, ev.touches[0].clientY)
    }
    const onTouchEnd = () => {
      mouse.active = false
    }
    if (!reduceMotion) {
      canvas.addEventListener("mousemove", onMouseMove)
      canvas.addEventListener("mouseleave", onMouseLeave)
      canvas.addEventListener("touchmove", onTouchMove, { passive: true })
      canvas.addEventListener("touchend", onTouchEnd)
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

    if (reduceMotion) {
      renderStill()
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      canvas.removeEventListener("mousemove", onMouseMove)
      canvas.removeEventListener("mouseleave", onMouseLeave)
      canvas.removeEventListener("touchmove", onTouchMove)
      canvas.removeEventListener("touchend", onTouchEnd)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
}

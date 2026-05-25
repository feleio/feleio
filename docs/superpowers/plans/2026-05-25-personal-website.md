# fele.io Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page dark-themed portfolio site for Chun Lok Ling at fele.io with a Three.js shader animation hero and full career content.

**Architecture:** Single-page Next.js App Router site. One `page.tsx` composes section components. The `ShaderAnimation` component (provided) renders a full-viewport WebGL shader as the hero background. All content sections live below in a scrollable layout. Tailwind CSS handles all styling with a custom dark theme using ice blue accent (`#bae6fd`).

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, Three.js, lucide-react

---

## File Structure

```
app/
  layout.tsx          — Root layout, global font/meta, dark bg
  page.tsx            — Main page composing all sections
  globals.css         — Tailwind directives + custom CSS vars
components/
  ui/
    shader-animation.tsx  — Three.js WebGL shader (provided component)
  sections/
    hero.tsx              — Hero section with ShaderAnimation + overlay
    about.tsx             — About section with summary + stats
    experience.tsx        — Experience timeline with full details
    skills.tsx            — Skills 3-column grid
    education.tsx         — Education entries
    footer.tsx            — Footer with social links + year
tailwind.config.ts    — Extended theme colors
```

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`, etc. (all via CLI scaffolding)

The project directory has a stale `.next` folder and a `.superpowers` folder from brainstorming. We need to clean up before scaffolding.

- [ ] **Step 1: Remove stale `.next` directory**

Run:
```bash
rm -rf .next
```

- [ ] **Step 2: Scaffold Next.js with TypeScript and Tailwind**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --yes
```

Expected: Project files created. `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore` all present.

- [ ] **Step 3: Initialize shadcn/ui**

Run:
```bash
npx shadcn@latest init --defaults
```

Expected: `components.json` created. `lib/utils.ts` created.

- [ ] **Step 4: Install Three.js and lucide-react**

Run:
```bash
npm install three @types/three lucide-react
```

Expected: Packages added to `package.json` dependencies.

- [ ] **Step 5: Add `.superpowers` to `.gitignore`**

Append to `.gitignore`:
```
# Brainstorming artifacts
.superpowers/
```

- [ ] **Step 6: Create sections directory**

Run:
```bash
mkdir -p components/sections
```

- [ ] **Step 7: Verify dev server starts**

Run:
```bash
npm run dev
```

Expected: Server starts on `http://localhost:3000` with the default Next.js page.

- [ ] **Step 8: Commit scaffold**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with shadcn, Tailwind, Three.js"
```

---

### Task 2: Configure Theme and Global Styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Extend Tailwind config with custom theme colors**

Replace `tailwind.config.ts` with:

```ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        accent: {
          DEFAULT: "#bae6fd",
          dim: "rgba(186,230,253,0.12)",
          border: "rgba(186,230,253,0.15)",
        },
        text: {
          primary: "#f0f0f0",
          secondary: "#b0b0b0",
          muted: "#999999",
          dimmed: "#777777",
          subtle: "#555555",
        },
        card: {
          border: "#1c1c1c",
        },
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 2: Set up globals.css**

Replace `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background: #050505;
  color: #f0f0f0;
}
```

- [ ] **Step 3: Update root layout**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Chun Lok Ling — Senior Software Engineer",
  description:
    "Distributed Systems · AI & Agentic Engineering · High-Performance FinTech",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Verify the dev server shows a dark page**

Run `npm run dev`, open `http://localhost:3000`. Page should have a `#050505` dark background.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts app/globals.css app/layout.tsx
git commit -m "feat: configure dark theme with ice blue accent colors"
```

---

### Task 3: Add ShaderAnimation Component

**Files:**
- Create: `components/ui/shader-animation.tsx`

- [ ] **Step 1: Create the ShaderAnimation component**

Create `components/ui/shader-animation.tsx` with exactly this content:

```tsx
"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: any
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }

        gl_FragColor = vec4(color[0],color[1],color[2],1.0);
      }
    `

    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)

    container.appendChild(renderer.domElement)

    const onWindowResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.05
      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    }

    animate()

    return () => {
      window.removeEventListener("resize", onWindowResize)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-screen"
      style={{
        background: "#000",
        overflow: "hidden",
      }}
    />
  )
}
```

- [ ] **Step 2: Verify it renders**

Temporarily update `app/page.tsx`:

```tsx
import { ShaderAnimation } from "@/components/ui/shader-animation"

export default function Home() {
  return <ShaderAnimation />
}
```

Run `npm run dev`, open `http://localhost:3000`. You should see the animated shader filling the viewport — colorful concentric ring patterns on a black background.

- [ ] **Step 3: Commit**

```bash
git add components/ui/shader-animation.tsx app/page.tsx
git commit -m "feat: add Three.js ShaderAnimation component"
```

---

### Task 4: Build Hero Section

**Files:**
- Create: `components/sections/hero.tsx`

- [ ] **Step 1: Create the Hero component**

Create `components/sections/hero.tsx`:

```tsx
import { ShaderAnimation } from "@/components/ui/shader-animation"

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <ShaderAnimation />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-accent">
          Senior Software Engineer
        </p>
        <h1 className="mb-3 text-[28px] font-bold tracking-tight text-white sm:text-4xl md:text-[56px] md:leading-tight">
          Chun Lok Ling
        </h1>
        <p className="max-w-[560px] text-sm text-text-secondary sm:text-base md:text-lg">
          Distributed Systems · AI &amp; Agentic Engineering · High-Performance
          FinTech
        </p>
      </div>
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-center">
        <p className="text-xs uppercase tracking-[0.15em] text-text-subtle">
          Scroll
        </p>
        <div className="mx-auto mt-2 h-10 w-px bg-text-subtle" />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Update `app/page.tsx`:

```tsx
import { Hero } from "@/components/sections/hero"

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  )
}
```

Run `npm run dev`. Should see the shader animation as full-screen background with name, title, and tagline overlaid in center, scroll indicator at bottom.

- [ ] **Step 3: Commit**

```bash
git add components/sections/hero.tsx app/page.tsx
git commit -m "feat: add Hero section with shader animation background"
```

---

### Task 5: Build About Section

**Files:**
- Create: `components/sections/about.tsx`

- [ ] **Step 1: Create the About component**

Create `components/sections/about.tsx`:

```tsx
const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "4", label: "Industries" },
  { value: "6", label: "Companies" },
]

export function About() {
  return (
    <section className="mx-auto max-w-[800px] px-6 py-16 md:py-24">
      <div className="mb-8 h-px w-10 bg-accent opacity-40" />
      <p className="mb-8 text-[11px] uppercase tracking-[0.25em] text-accent">
        About
      </p>
      <p className="max-w-[600px] text-base leading-relaxed text-text-secondary md:text-lg md:leading-relaxed">
        I am a high-execution software engineer specializing in building robust,
        high-performance systems across FinTech, HealthTech, and Blockchain. I
        thrive in fast-paced environments where technical complexity meets the
        need for rapid, pragmatic delivery.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-10">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-2xl font-bold text-accent md:text-3xl">
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-text-dimmed">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to page**

Update `app/page.tsx`:

```tsx
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
    </main>
  )
}
```

- [ ] **Step 3: Verify in browser and commit**

Check `http://localhost:3000` — scroll past hero to see About section with accent divider, label, summary text, and three stats.

```bash
git add components/sections/about.tsx app/page.tsx
git commit -m "feat: add About section with stats"
```

---

### Task 6: Build Experience Section

**Files:**
- Create: `components/sections/experience.tsx`

- [ ] **Step 1: Create the Experience component**

Create `components/sections/experience.tsx`:

```tsx
const experiences = [
  {
    date: "2022 — Present",
    title: "Senior Software Engineer",
    company: "Digital Asset · Canton Network Utility Team",
    location: "London",
    bullets: [
      "Drive development of mission-critical backend utilities for institutional-grade DLT",
      "Built high-performance infrastructure using Scala and Daml",
      "Built foundational distributed ledger components for the Canton Network",
      "Delivered secure, production-ready code for high-integrity systems",
    ],
    tags: ["Scala", "Daml", "DLT"],
  },
  {
    date: "2016 — 2022",
    title: "Senior Software Engineer",
    company: "Babylon Health · AI Engineering",
    location: "London",
    bullets: [
      "Designed scalable Scala and Akka-HTTP microservices for a global clinical platform",
      "Managed full-lifecycle deployments using Docker and Kubernetes",
      "Built robust backend microservices for global chatbot platforms",
      "Partnered with clinical teams to translate complex requirements into high-performance code",
    ],
    tags: ["Scala", "Akka-HTTP", "Java", "Docker", "Kubernetes"],
  },
  {
    date: "2015 — 2016",
    title: "Senior Software Engineer",
    company: "Amber Road",
    location: "Hong Kong",
    bullets: [],
    tags: [],
  },
  {
    date: "2010 — 2014",
    title: "Software Engineer",
    company: "Thomson Reuters",
    location: "Hong Kong",
    bullets: [
      "Developed core components for the Global Market Data Network using C++",
      "Contributed to 14 major project releases through high-speed, reliable execution",
    ],
    tags: ["C++"],
  },
]

export function Experience() {
  return (
    <section className="mx-auto max-w-[800px] px-6 py-16 md:py-24">
      <div className="mb-8 h-px w-10 bg-accent opacity-40" />
      <p className="mb-8 text-[11px] uppercase tracking-[0.25em] text-accent">
        Experience
      </p>
      <div className="flex flex-col">
        {experiences.map((exp) => (
          <div
            key={exp.date}
            className="flex flex-col gap-2 border-b border-card-border py-6 last:border-b-0 md:flex-row md:gap-6"
          >
            <div className="min-w-[90px] text-[11px] tabular-nums text-accent md:pt-1">
              {exp.date}
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-text-primary">
                {exp.title}
              </div>
              <div className="text-[15px] font-semibold text-[#ddd]">
                {exp.company}
              </div>
              {exp.bullets.length > 0 && (
                <ul className="mt-2 list-disc pl-4 text-[13px] leading-[1.8] text-text-muted">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet} className="mb-1">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {exp.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-accent-border bg-accent-dim px-2 py-0.5 text-[11px] text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to page**

Update `app/page.tsx`:

```tsx
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Experience } from "@/components/sections/experience"

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
    </main>
  )
}
```

- [ ] **Step 3: Verify in browser and commit**

Check `http://localhost:3000` — scroll to see the full experience timeline with dates, titles, bold company names, bullet points, and tech tags.

```bash
git add components/sections/experience.tsx app/page.tsx
git commit -m "feat: add Experience section with full detail timeline"
```

---

### Task 7: Build Skills Section

**Files:**
- Create: `components/sections/skills.tsx`

- [ ] **Step 1: Create the Skills component**

Create `components/sections/skills.tsx`:

```tsx
const skillGroups = [
  {
    title: "Languages",
    skills: ["Scala", "Java", "TypeScript", "C++", "Python"],
  },
  {
    title: "Infrastructure",
    skills: ["Docker", "Kubernetes", "CI/CD"],
  },
  {
    title: "Frameworks",
    skills: ["Akka-HTTP", "fs2", "React", "Daml"],
  },
]

export function Skills() {
  return (
    <section className="mx-auto max-w-[800px] px-6 py-16 md:py-24">
      <div className="mb-8 h-px w-10 bg-accent opacity-40" />
      <p className="mb-8 text-[11px] uppercase tracking-[0.25em] text-accent">
        Skills
      </p>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {skillGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-3 text-[13px] font-semibold text-text-primary">
              {group.title}
            </h3>
            <div className="flex flex-col gap-2">
              {group.skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 text-[13px] text-text-secondary"
                >
                  <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to page**

Update `app/page.tsx`:

```tsx
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Experience } from "@/components/sections/experience"
import { Skills } from "@/components/sections/skills"

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Skills />
    </main>
  )
}
```

- [ ] **Step 3: Verify in browser and commit**

Check `http://localhost:3000` — skills section shows 3-column grid on desktop, 2 on tablet, 1 on phone. Each skill has an accent dot.

```bash
git add components/sections/skills.tsx app/page.tsx
git commit -m "feat: add Skills section with responsive grid"
```

---

### Task 8: Build Education Section

**Files:**
- Create: `components/sections/education.tsx`

- [ ] **Step 1: Create the Education component**

Create `components/sections/education.tsx`:

```tsx
const education = [
  {
    date: "2007 — 2010",
    school: "The Hong Kong University of Science and Technology",
    degree: "Bachelor's Degree, Computer Science · First Class Honours",
  },
  {
    date: "2009",
    school: "University of Southampton",
    degree: "Exchange Programme, Computer Science",
  },
]

export function Education() {
  return (
    <section className="mx-auto max-w-[800px] px-6 py-16 md:py-24">
      <div className="mb-8 h-px w-10 bg-accent opacity-40" />
      <p className="mb-8 text-[11px] uppercase tracking-[0.25em] text-accent">
        Education
      </p>
      <div className="flex flex-col">
        {education.map((edu) => (
          <div
            key={edu.school}
            className="flex flex-col gap-2 border-b border-card-border py-5 last:border-b-0 md:flex-row md:gap-6"
          >
            <div className="min-w-[90px] text-[11px] text-accent md:pt-1">
              {edu.date}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-text-primary">
                {edu.school}
              </div>
              <div className="text-[13px] text-text-secondary">
                {edu.degree}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to page**

Update `app/page.tsx`:

```tsx
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Experience } from "@/components/sections/experience"
import { Skills } from "@/components/sections/skills"
import { Education } from "@/components/sections/education"

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Education />
    </main>
  )
}
```

- [ ] **Step 3: Verify in browser and commit**

Check `http://localhost:3000` — education section with HKUST showing "First Class Honours" and Southampton as exchange programme.

```bash
git add components/sections/education.tsx app/page.tsx
git commit -m "feat: add Education section"
```

---

### Task 9: Build Footer

**Files:**
- Create: `components/sections/footer.tsx`

- [ ] **Step 1: Create the Footer component**

Create `components/sections/footer.tsx`:

```tsx
"use client"

import { Linkedin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="mx-auto flex max-w-[800px] flex-col items-center gap-5 border-t border-card-border px-6 py-14 sm:flex-row sm:justify-between">
      <div className="flex gap-4">
        <a
          href="https://www.linkedin.com/in/chun-lok-ling-195a923b"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-card-border px-4 py-2 text-[13px] text-text-secondary transition-colors hover:border-accent hover:text-accent"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </a>
        <a
          href="https://github.com/feleio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-card-border px-4 py-2 text-[13px] text-text-secondary transition-colors hover:border-accent hover:text-accent"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
      </div>
      <div className="text-[11px] text-text-subtle">
        {new Date().getFullYear()} Chun Lok Ling
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Add to page — final page.tsx**

Update `app/page.tsx` to its final form:

```tsx
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Experience } from "@/components/sections/experience"
import { Skills } from "@/components/sections/skills"
import { Education } from "@/components/sections/education"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Education />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 3: Verify in browser and commit**

Check `http://localhost:3000` — footer shows LinkedIn and GitHub pill buttons on the left, dynamic year + name on the right. Hover state changes border/text to accent color.

```bash
git add components/sections/footer.tsx app/page.tsx
git commit -m "feat: add Footer with LinkedIn and GitHub links"
```

---

### Task 10: Final Verification and Build Check

**Files:** None (verification only)

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Test production server**

```bash
npm run start
```

Open `http://localhost:3000`. Verify:
- Shader animation renders and animates in the hero
- Name, title, tagline overlay correctly on the shader
- Scroll indicator visible at bottom of hero
- About section has summary text and 3 stats
- Experience section shows all 4 companies with correct detail levels
- Skills section shows 3-column grid
- Education shows HKUST with "First Class Honours"
- Footer shows LinkedIn + GitHub buttons and dynamic year
- Resize to mobile width: layout stacks correctly, text sizes reduce

- [ ] **Step 3: Commit any fixes and final commit**

```bash
git add -A
git commit -m "chore: final verification pass"
```

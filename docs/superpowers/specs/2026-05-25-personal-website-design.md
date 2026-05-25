# Personal Website — fele.io

## Overview

A single-page personal portfolio website for Chun Lok Ling, a Senior Software Engineer at Digital Asset. The site uses a full-screen Three.js shader animation as the hero, followed by scrollable content sections presenting career experience, skills, and education.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **3D**: Three.js (shader animation hero)
- **Icons**: lucide-react
- **Domain**: fele.io

## Visual Design

- **Theme**: Dark background (`#050505`) with ice blue accent (`#bae6fd`)
- **Typography**: System font stack (system-ui, -apple-system, sans-serif)
- **Contrast**: High — primary text `#f0f0f0`, secondary `#b0b0b0`, muted `#999`
- **Accent usage**: Section labels, date indicators, tech tags, skill dots, divider lines
- **Tag style**: `background: rgba(186,230,253,0.12)`, `border: rgba(186,230,253,0.15)`, `color: #bae6fd`

## Page Structure

Single scrollable page. No client-side routing needed.

### 1. Hero (full viewport height)

- **Background**: `ShaderAnimation` component (Three.js WebGL) fills the entire viewport
- **Overlay content** (centered, z-indexed above shader):
  - Label: "Senior Software Engineer" — uppercase, letter-spaced, accent color
  - Name: "Chun Lok Ling" — large bold heading (56px desktop, 36px tablet, 28px phone)
  - Tagline: "Distributed Systems · AI & Agentic Engineering · High-Performance FinTech"
- **Scroll indicator** at bottom: "Scroll" text with a vertical line below it

### 2. About

- Section label: "ABOUT" in accent color with a 40px accent divider above
- Summary paragraph from profile
- Three highlight stats in a row:
  - 15+ Years Experience
  - 4 Industries
  - 6 Companies

### 3. Experience

- Section label: "EXPERIENCE"
- Full-detail timeline, each entry contains:
  - Date range (accent color, left column on desktop, stacked on mobile)
  - Job title (bold, `#f0f0f0`)
  - Company + team name (bold, `#ddd`) — same visual weight as title
  - Bullet points describing work (`#999`)
  - Tech tags as accent-colored pills

**Entries:**

1. **Digital Asset · Canton Network Utility Team** (2022 — Present)
   - Senior Software Engineer
   - Drive development of mission-critical backend utilities for institutional-grade DLT
   - Built high-performance infrastructure using Scala and Daml
   - Built foundational distributed ledger components for the Canton Network
   - Delivered secure, production-ready code for high-integrity systems
   - Tags: Scala, Daml, DLT

2. **Babylon Health · AI Engineering** (2016 — 2022)
   - Senior Software Engineer
   - Designed scalable Scala and Akka-HTTP microservices for a global clinical platform
   - Managed full-lifecycle deployments using Docker and Kubernetes
   - Built robust backend microservices for global chatbot platforms
   - Partnered with clinical teams to translate complex requirements into high-performance code
   - Tags: Scala, Akka-HTTP, Java, Docker, Kubernetes

3. **Amber Road** (2015 — 2016)
   - Senior Software Engineer
   - (no bullet points)

4. **Thomson Reuters** (2010 — 2014)
   - Software Engineer
   - Developed core components for the Global Market Data Network using C++
   - Contributed to 14 major project releases through high-speed, reliable execution
   - Tags: C++

### 4. Skills

- Section label: "SKILLS"
- 3-column grid (2 on tablet, 1 on phone):
  - **Languages**: Scala, Java, TypeScript, C++, Python
  - **Infrastructure**: Docker, Kubernetes, CI/CD
  - **Frameworks**: Akka-HTTP, fs2, React, Daml
- Each skill has an accent-colored dot indicator

### 5. Education

- Section label: "EDUCATION"
- Two entries:
  1. **The Hong Kong University of Science and Technology** (2007 — 2010)
     - Bachelor's Degree, Computer Science · First Class Honours
  2. **University of Southampton** (2009)
     - Exchange Programme, Computer Science

### 6. Footer

- Top border divider
- Left: LinkedIn and GitHub icon links (lucide-react icons) in bordered pill buttons
- Right: Dynamic year + "Chun Lok Ling" (no copyright symbol)
- Links:
  - LinkedIn: https://www.linkedin.com/in/chun-lok-ling-195a923b
  - GitHub: https://github.com/feleio

## Components

### ShaderAnimation (`components/ui/shader-animation.tsx`)

Pre-built component provided by the user. Three.js WebGL shader with animated concentric rings. Takes no props, renders a full `w-full h-screen` container with black background.

### Page composition (`app/page.tsx`)

The main page composes all sections. The hero wraps `ShaderAnimation` in a relative container with the overlay text positioned absolutely on top.

Remaining sections (About, Experience, Skills, Education, Footer) are rendered as semantic HTML sections with Tailwind utility classes.

## Responsive Breakpoints

| Breakpoint | Hero name | Layout | Skills grid | Experience |
|---|---|---|---|---|
| >768px (desktop) | 56px | Side-by-side dates | 3 columns | Horizontal |
| <=768px (tablet) | 36px | Stacked dates | 2 columns | Stacked |
| <=480px (phone) | 28px | Stacked, compact | 1 column | Stacked |

## Dependencies

```json
{
  "three": "latest",
  "@types/three": "latest"
}
```

Plus standard Next.js + shadcn/ui + Tailwind CSS + lucide-react dependencies from project scaffolding.

## Project Setup

Since the project is empty, scaffold from scratch:

1. `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"`
2. `npx shadcn@latest init`
3. `npm install three @types/three`
4. Copy `ShaderAnimation` component to `components/ui/shader-animation.tsx`
5. Build page in `app/page.tsx`

## Out of Scope

- Blog / writing section
- Contact form
- Email link
- Dark/light mode toggle (dark only)
- Analytics
- SEO meta tags (can add later)
- Animations/transitions on scroll (keep it simple)

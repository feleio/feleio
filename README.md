# fele.io

Personal site of Chun Lok Ling — the "Topology" design: a force-directed
canvas graph of a 15-year career as the hero, dark terminal aesthetic
(Sora + IBM Plex Mono, iris/teal on `#0A0B12`).

## Stack

- Next.js 16 (App Router) + React 19, TypeScript
- Hand-written CSS design system in `app/globals.css` (Tailwind is installed
  but effectively unused)
- `components/ui/topology-graph.tsx` — the canvas force simulation
  (spring/charge physics, packet traffic, clickable role nodes; composed
  constellation on narrow screens)
- `lib/content.ts` — single source of truth for all site content

## Develop

```bash
npm run dev     # http://localhost:3000
npm run build   # also statically generates the OG image, sitemap, robots
npm run lint
```

If the dev server serves stale CSS after a syntax error: `rm -rf .next`.

## Deploy

No GitHub auto-deploy. Ship manually from the repo root:

```bash
npx --yes vercel@latest --prod --yes
```

Production is aliased to https://fele.io.

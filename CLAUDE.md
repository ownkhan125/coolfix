@AGENTS.md

# CoolFix — Project Instructions

## About the project

CoolFix is a portfolio project: an AI lead assistant for a home-service business (AC repair and plumbing). A customer sends a message and a photo, the assistant scores the lead, books a time slot and saves the contact to a CRM. The business owner sees everything in a dashboard.

The developer is mid-level and must be able to read, own and extend every file without help. Clarity always beats cleverness.

## Stack

- Next.js, App Router, JavaScript only (`.js` / `.jsx`). No TypeScript.
- Tailwind CSS + plain CSS files. Styling rules are in `.claude/rules/styling.md`.
- Motion for animation: `import { motion } from "motion/react"`.
- Font: Plus Jakarta Sans via `next/font/google`.

## Commands

- `npm run dev` — start local server
- `npm run build` — production build
- `npm run lint` — run ESLint

## Folder structure

- `app/` — routes and pages only. A `page.jsx` composes section components.
- `app/api/<name>/route.js` — backend endpoints.
- `components/layout/` — Navbar, Footer.
- `components/sections/` — page sections (HeroSection, FeaturesSection).
- `components/ui/` — small reusable pieces (Button, GlassCard, Badge, IconBox).
- `lib/` — helpers and third-party API calls, one file per service.
- `styles/` — CSS files (see styling rules).
- `public/images/` — images.

## Code rules

- Write code a mid-level developer can understand in one read. No clever abstractions, no custom hooks, no React Context, no state libraries unless I ask.
- Allowed exception: BookingModalContext and ChatWidgetContext for global modal state.
- Exception: `components/three/useSceneScroll.js` is the one allowed custom hook (3D scroll choreography). Section reveal animations use `useGSAP` directly inside each section file.
- One component per file. Component files use PascalCase (`HeroSection.jsx`). Folders, routes and CSS files use kebab-case.
- Use descriptive, professional names: `handleBookingSubmit`, `leadScore`, `isMenuOpen`. Never `data`, `temp`, `x`, `fn`.
- Create a reusable component only when the same UI appears 2 or more times. Keep its props simple (title, text, icon, children).
- If a file grows past ~150 lines, ask me before splitting it.
- Do not install any new package without asking me first.
- Add `"use client"` only to components that need it (state, events, Motion).

## Static text

- Write all static text (headings, paragraphs, button labels, card titles) directly in the JSX, at the exact place it appears on the page.
- Do NOT put static text in JSON files, constants files, or arrays rendered with `.map()`.
- Use `.map()` only for dynamic data from the API or database (leads, bookings, chat messages).
- Repeated components get their text as props at the place they are used:

```jsx
<FeatureCard title="Snap the problem" text="We understand it from a photo." />
<FeatureCard title="Pick a time" text="Real slots, booked instantly." />
```

- All UI text and all code comments are in English.

## Comments

- Add a short English comment above every component and above any logic that is not obvious.
- Mark each major JSX block, for example: `{/* Hero: headline and call-to-action buttons */}`
- Do not comment obvious lines.

## How to work with me

- Before creating or changing more than 3 files, show the plan (file names + purpose) and wait for my approval.
- After each task, give a short summary: files created or changed, and where each new component, function and CSS class lives.
- Never rewrite or delete code I did not ask you to touch.
- When I say "do not change anything", only read files, run read-only commands, and report. No edits.
- Never install packages, tools or skills (including Playwright) without asking me first.

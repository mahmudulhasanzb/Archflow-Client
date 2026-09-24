# Archflow — AI Multi-Agent Architecture Engine

An enterprise-grade, agentic software engineering platform that orchestrates specialized AI agents to generate production-ready software architecture specs, technical blueprints, and full markdown documentation suites.

[![Live Application](https://img.shields.io/badge/Live-Demo-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://archflow-web-ai.vercel.app/)
[![Frontend Repo](https://img.shields.io/badge/GitHub-Frontend_Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mahmudulhasanzb/Archflow-Client.git)
[![Backend Repo](https://img.shields.io/badge/GitHub-Backend_Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mahmudulhasanzb/Archflow-Server.git)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Multi-Agent Pipeline](#multi-agent-pipeline)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Architecture & Data Flow](#architecture--data-flow)
- [Component Reference](#component-reference)
- [Security & Access Control](#security--access-control)
- [Accessibility & Standards](#accessibility--standards)
- [License](#license)

---

## Overview

**Archflow** transforms natural language system prompts into fully articulated engineering architecture blueprints. Instead of generating generic code snippets, Archflow coordinates a pipeline of specialized AI agents to analyze requirements, construct system topologies, model database schemas, and output standard MDX architectural specifications.

Engineers, tech leads, and product teams use Archflow to accelerate the discovery and system design phase from weeks to minutes.

---

## Tech Stack

| Layer | Technology | Version / Details |
|---|---|---|
| **Framework** | Next.js | 16.3.5 (App Router, Turbopack) |
| **Frontend Library** | React | 19.0.0 |
| **Styling** | Tailwind CSS | v4 (`@tailwindcss/typography`, OKLCH tokens) |
| **Icons & Motion** | Lucide React & Framer Motion | Dynamic deferred animations |
| **AI Models (Blueprint)** | NVIDIA NeMoTron-3 Ultra | 550B MoE, 1M context window |
| **AI Models (Support)** | nex-agi n2.5-mini | Low-latency plain-text assistant |
| **Backend API** | Express | 5.x (Node.js 22, TypeScript) |
| **Database** | MongoDB Atlas | Native Driver (Connection pooling & projections) |
| **Authentication** | Better Auth | MongoDB adapter + JWT + JWKS bridge |
| **Payments** | Stripe | Dynamic subscription checkout sessions |
| **Package Manager** | npm / pnpm | `package-lock.json` |
| **Deployment** | Vercel | Production CDN edge network |

---

## Features

- **4-Stage multi-agent synthesis** — Coordinated AI pipeline generating project overview, functional specs, data models, and design systems.
- **550B MoE blueprint reasoning** — Powered by NVIDIA NeMoTron-3 Ultra with 1,000,000 token context window for exhaustive architectures.
- **Interactive architecture workspace** — Live stepper progression, tabbed spec viewer, and syntax-highlighted MDX preview.
- **1-Click suite export** — Client-side ZIP compilation bundling all four architectural documents into downloadable suites.
- **Bring Your Own Key (BYOK)** — Free, Pro, and Admin users can plug in their own OpenRouter API key to bypass default generation quotas.
- **Real-time credit tracker** — Live balance metrics and quota indicator badges embedded directly in the Blueprint Studio.
- **Embedded AI support chat** — Low-latency, plain-text technical assistant with deep context of Archflow auth rules and troubleshooting.
- **Resilient AI fallback pool** — Auto-failover across multiple models to guarantee zero downtime if an upstream provider rate-limits.
- **Mandatory email verification** — Automated Nodemailer verification links with instant auto-login upon confirmation.
- **Google OAuth social login** — 1-click verified authentication powered by Better Auth.
- **Stripe subscription billing** — Seamless Pro upgrades with monthly and annual discount tiers.
- **Unified edge middleware guard** — Fast-path cookie evaluation protecting all `/workspace/*` routes with RBAC redirects in < 20 ms.
- **Accessible & high-performance** — WCAG AA color contrast, semantic HTML landmarks, tap targets ≥ 44 px, and 100/100 accessibility score.

---

## Project Structure

```
Archflow/
├── Archflow-Client/                      # Next.js 16 App Router Client
│   ├── public/                           # Static assets, branding, and icons
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/                   # Signin, signup, and verification modal
│   │   │   ├── (dashboardLayout)/        # Authenticated workspace shell
│   │   │   │   └── workspace/
│   │   │   │       ├── page.tsx          # Telemetry & workspace dashboard
│   │   │   │       ├── add-blueprint/    # AI Blueprint Studio (studio generator)
│   │   │   │       ├── my-blueprints/    # Personal user blueprint library
│   │   │   │       ├── api-settings/     # BYOK OpenRouter key & credit tracker
│   │   │   │       ├── manage-blueprints/# Admin blueprint moderation
│   │   │   │       └── admin/            # User & transaction control consoles
│   │   │   ├── (mainLayout)/             # Public marketing site & gallery
│   │   │   │   ├── about/                # Product mission & engineering overview
│   │   │   │   └── blueprints/           # Public blueprint gallery & viewer
│   │   │   ├── api/                      # Auth catch-all & Stripe checkout routes
│   │   │   ├── globals.css               # OKLCH design tokens & Tailwind v4 theme
│   │   │   └── layout.tsx                # Root layout, dynamic SupportChat, fonts
│   │   ├── components/
│   │   │   ├── admin/                    # Admin data tables, filters, role modals
│   │   │   ├── blueprint/                # Spec viewers, stepper, export buttons
│   │   │   ├── landing/                  # Hero, features, pricing, FAQ, reviews
│   │   │   ├── layout/                   # Navbar, footer, dashboard sidebar
│   │   │   └── SupportChat.tsx           # Floating AI technical support assistant
│   │   └── lib/
│   │       ├── api/                      # Blueprint generator & Support agent APIs
│   │       ├── auth.ts                   # Better Auth server configuration
│   │       └── email.ts                  # Nodemailer verification dispatcher
│   ├── .env.example                      # Documented environment template
│   └── package.json
│
└── Archflow-Server/                      # Express 5 API Microservice
    ├── src/
    │   └── index.ts                      # Single-file API, MongoDB pool, JWKS bridge
    ├── .env.example                      # Server environment template
    └── package.json
```

---

## Multi-Agent Pipeline

```
User Prompt (Single Paragraph Idea)
    │
    ▼
[ Agent 01: System Architect ] ──► projectOverview.md
  - High-level topology, tech stack selection, NFRs
    │
    ▼
[ Agent 02: Requirements Engineer ] ──► requirements.md
  - Functional breakdown, user stories, acceptance criteria
    │
    ▼
[ Agent 03: Data & Systems Modeler ] ──► architecture.md
  - Database schema, API specifications, sequence diagrams
    │
    ▼
[ Agent 04: UI/UX & Design Systems ] ──► designSystem.md
  - Design tokens, component hierarchies, responsive layout
    │
    ▼
1-Click ZIP Suite Export (.zip download or cloud save)
```

---

## Getting Started

### Prerequisites

- **Node.js** `>= 20.x`
- **npm** or **pnpm**
- **MongoDB Atlas** database cluster
- **OpenRouter API Key** (for AI synthesis)
- **Stripe Account** (for subscription billing)

### 1. Backend Setup

```bash
cd Archflow-Server
npm install
cp .env.example .env
npm run dev
```

*Server starts on `http://localhost:5000`.*

### 2. Frontend Setup

```bash
cd Archflow-Client
npm install
cp .env.example .env
npm run dev
```

*Client starts on `http://localhost:3000`.*

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Starts local Next.js dev server with Turbopack |
| `npm run build` | Compiles optimized production bundle with type checking |
| `npm run start` | Boots production server |
| `npm run lint` | Runs Next.js ESLint validation |
| `npx tsc --noEmit` | Validates TypeScript types across entire codebase |

---

## Architecture & Data Flow

### Session & Identity Bridge

```
Next.js Client (Browser)
    │  (Better Auth Session Cookie)
    ▼
Edge Middleware (`proxy.ts`)
    │  (Validates session token in < 20 ms)
    ▼
Next.js API Handler (`/api/auth/*`)
    │  (Exposes public JWKS endpoint)
    ▼
Express Microservice (`Archflow-Server`)
    │  (Asymmetric verification via `jose` + `x-internal-secret`)
    ▼
MongoDB Atlas Native Driver
```

### Key Design Decisions

- **Single source of truth in workspace**: All authenticated tools live under `/workspace/*`, sharing a unified sidebar shell and token telemetry.
- **Dynamic AI chunking**: Heavy interactive widgets (like `SupportChat` and `framer-motion`) are dynamically imported with deferred client execution to eliminate render-blocking JS on initial paint.
- **Zero-downtime AI fallback**: Both blueprint synthesis and support chat loop through a resilient pool of models with graceful error catching on 404, 429, or 500 responses.
- **Strict query sanitization**: All user-supplied search parameters and tags are sanitized through `escapeRegex` to prevent NoSQL and ReDoS injections.

---

## Component Reference

| Component | Location | Purpose |
|---|---|---|
| `SupportChat` | `components/SupportChat.tsx` | Floating AI assistant with fallback pool and auth context |
| `Navbar` | `components/layout/Navbar.tsx` | Responsive header with auth status, mobile drawer, and quick links |
| `Footer` | `components/layout/Footer.tsx` | Accessible footer with min 44 px touch targets and semantic landmarks |
| `VerificationModal` | `app/(auth)/VerificationModal.tsx` | Auto-dispatched modal prompting users to check their verification email |
| `FAQ` | `components/landing/FAQ.tsx` | Accessible accordion with JSON-LD schema and `aria-expanded` state |
| `Testimonials` | `components/landing/Testimonials.tsx` | Social proof showcase with strict heading hierarchy |
| `AddBlueprintStudio` | `app/(dashboardLayout)/workspace/add-blueprint` | Interactive studio orchestrating the 4-stage generation pipeline |
| `ApiSettings` | `app/(dashboardLayout)/workspace/api-settings` | BYOK OpenRouter key configuration and live balance monitor |

---

## Security & Access Control

- **Edge Route Protection:** All `/workspace/*` paths evaluate authenticated cookies at the edge, rejecting unauthorized requests before hitting the database.
- **Role-Based Access Control (RBAC):** Admin consoles (`/workspace/admin/*`) verify administrative privileges on both client middleware and backend API endpoints.
- **Cryptographic JWKS Bridge:** Next.js and Express communicate using asymmetric JWT verification (`jose`) and shared internal headers (`x-internal-secret`).
- **Defensive Projections:** User queries strictly exclude `password` and `customApiKey` fields to prevent secret leakage in admin tables.
- **Origin-Locked CORS:** Cross-Origin Resource Sharing is locked to authorized deployment URLs (`https://archflow-web-ai.vercel.app`) and local dev hosts.

---

## Accessibility & Standards

- **WCAG AA Compliance:** All text tokens meet or exceed 4.5:1 contrast ratio in both Light and Dark themes (`oklch` tailored palette).
- **Semantic Landmarks:** Full structure with `<header>`, `<main id="main-content">`, `<section>`, and `<footer>`.
- **Keyboard Navigation:** Focus rings and visible `:focus-visible` styling across all interactive elements.
- **Touch-Friendly Targets:** All interactive links and buttons enforce minimum dimensions of `44 × 44 px`.
- **Screen Reader Support:** Icon-only buttons feature explicit `aria-label` tags, and dynamic accordions announce `aria-expanded` state.

---

## License

MIT © [Mahmudul Hasan](https://github.com/mahmudulhasanzb). Built for the EJP-SCIC Agentic-AI Assessment.

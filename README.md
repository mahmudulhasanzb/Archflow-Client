# 🏗️ Archflow — AI Multi-Agent Architecture Engine

> An enterprise-grade, agentic software engineering platform that orchestrates specialized AI agents to generate production-ready software architecture specs, technical blueprints, and full markdown documentation suites.

[![Live Application](https://img.shields.io/badge/Live-Demo-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://archflow-web-ai.vercel.app/)
[![Frontend Repo](https://img.shields.io/badge/GitHub-Frontend_Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mahmudulhasanzb/Archflow-Client.git)
[![Backend Repo](https://img.shields.io/badge/GitHub-Backend_Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mahmudulhasanzb/Archflow-Server.git)

---

## 📌 Links

- **Live Deployment:** [https://archflow-web-ai.vercel.app/](https://archflow-web-ai.vercel.app/)
- **Frontend Repository:** [https://github.com/mahmudulhasanzb/Archflow-Client.git](https://github.com/mahmudulhasanzb/Archflow-Client.git)
- **Backend Repository:** [https://github.com/mahmudulhasanzb/Archflow-Server.git](https://github.com/mahmudulhasanzb/Archflow-Server.git)

---

## 🚀 Overview

**Archflow** transforms natural language system prompts into fully articulated engineering architecture blueprints. Instead of generating generic code snippets, Archflow coordinates a pipeline of specialized AI agents to analyze requirements, construct system topologies, model database schemas, and output standard MDX architectural specifications.

Engineers, tech leads, and product teams use Archflow to accelerate the discovery and system design phase from weeks to minutes.

---

## ✨ Key Features

### 🤖 4-Stage Multi-Agent Synthesis Pipeline
1. **Agent 01 — System Architect:** Analyzes high-level product intent, non-functional requirements (NFRs), and performance constraints to produce `projectOverview.md`.
2. **Agent 02 — Requirements Engineer:** Deconstructs system scope into verifiable functional specifications and acceptance criteria in `requirements.md`.
3. **Agent 03 — Data & Systems Modeler:** Designs database schemas, indexing strategies, API contracts, and integration models in `architecture.md`.
4. **Agent 04 — UI/UX & Design Systems Architect:** Outlines design tokens, responsive layout principles, component hierarchies, and interactive states in `designSystem.md`.

### ⚡ Interactive Architecture Workspace
- **Real-Time Step Progression:** Visual stepper displaying live status, latency metrics, and synthesis execution states.
- **Tabbed Spec Viewer & Live MDX Preview:** View generated markdown specs with syntax-highlighted code stubs, collapsible sections, and copyable snippets.
- **1-Click Suite Export:** Download entire architectural suites bundled into a single organized `.zip` file.
- **Direct Workspace Search & Filter:** Instant client-side filtering, category selection, sorting, and tag navigation.

### 🛡️ Secure Authentication & Role-Based Access Control
- Session management with JWT and JWKS token verification bridging the Next.js client and Express microservice.
- Tiered privileges: Free (up to 3 blueprints), Pro (up to 10 daily blueprints, custom LLM key integrations, private workspaces), and Admin.

### 💳 Stripe Subscription Billing
- Dynamic checkout session integration supporting monthly ($29/mo) and annual ($24/mo billed annually at $288/yr) plans.
- Automated webhook handling and instant account role upgrades with secure session verification.

---

## 🛠️ Technology Stack

### Frontend (`Archflow-Client`)
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19, TypeScript
- **Styling:** Tailwind CSS v4, `@tailwindcss/typography`
- **Animations & Icons:** Framer Motion, Lucide React
- **Markdown & Code:** `react-markdown`, `remark-gfm`, `prismjs`, `@mdx-js/loader`
- **Utilities:** `jszip`, `react-hot-toast`, `react-hook-form`
- **Deployment:** Vercel

### Backend (`Archflow-Server`)
- **Runtime:** Node.js, Express 5
- **Language:** TypeScript
- **Database:** MongoDB Native Driver (Clean single-file connection pool & projection patterns)
- **Auth & Cryptography:** `jose` (JWKS token bridge with asymmetric signature validation)
- **AI Integration:** OpenAI API
- **Payments:** Stripe SDK

---

## 📂 Project Architecture

```
Archflow/
├── Archflow-Client/                 # Next.js 16 App Router Client
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/             # Authentication routes (Sign In / Sign Up)
│   │   │   ├── (dashboardLayout)/  # Protected workspace, studio & management
│   │   │   │   ├── add-blueprint/
│   │   │   │   ├── manage-blueprints/
│   │   │   │   └── workspace/
│   │   │   ├── (mainLayout)/       # Public marketing pages & gallery
│   │   │   │   ├── about/
│   │   │   │   ├── blueprints/     # Public architecture repository
│   │   │   │   └── payment-success/
│   │   │   └── api/
│   │   │       ├── auth/           # Authentication endpoints
│   │   │       └── checkout_session/ # Stripe dynamic subscription checkout
│   │   ├── components/
│   │   │   ├── blueprint/          # Blueprint cards, filters, modals
│   │   │   ├── landing/            # Hero, features, pricing, FAQ
│   │   │   ├── layout/             # Navbar, footer, dashboard sidebar
│   │   │   └── ui/                 # Reusable inputs, buttons, pagination
│   │   └── lib/                    # Auth client, Stripe client, utilities
│   └── package.json
│
└── Archflow-Server/                 # Express 5 API Server
    ├── src/
    │   └── index.ts                # Unified modular API routes, MongoDB collections & auth middleware
    └── package.json
```

---

## ⚙️ Getting Started Locally

### Prerequisites
- Node.js `>= 20.x`
- MongoDB instance (local or MongoDB Atlas)
- Stripe account (with test API keys)
- OpenAI API key

---

### 1. Backend Setup (`Archflow-Server`)

```bash
cd Archflow-Server
npm install
```

Create a `.env` file in `Archflow-Server/`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/archflow?retryWrites=true&w=majority
OPENAI_API_KEY=your_openai_api_key
JWKS_URL=http://localhost:3000/api/auth/jwks
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Run the development server:
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

---

### 2. Frontend Setup (`Archflow-Client`)

```bash
cd Archflow-Client
npm install
```

Create a `.env.local` file in `Archflow-Client/`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/archflow?retryWrites=true&w=majority
BETTER_AUTH_SECRET=your_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 API & Security Highlights

- **Stateless Verification:** All secured API calls between client and server pass bearer tokens cryptographically validated against public JWKS endpoints.
- **Rate-Limiting & Quota Management:** Built-in per-user generation tracking prevents runaway API consumption and enforces subscription limits seamlessly.
- **Defensive Database Queries:** Strictly validated MongoDB projections, sanitization of user-submitted query parameters, and atomic update operators.

---


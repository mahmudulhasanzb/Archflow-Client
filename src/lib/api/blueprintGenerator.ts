'use server';

import OpenAI from 'openai';

function getOpenAIClient(customApiKey?: string): OpenAI {
  const baseURL = process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1';
  const apiKey =
    customApiKey?.trim() ||
    process.env.AI_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    '';

  return new OpenAI({
    baseURL: baseURL,
    apiKey: apiKey,
    dangerouslyAllowBrowser: false,
  });
}

const FALLBACK_MODELS = [
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'cohere/north-mini-code:free',
  'inclusionai/ling-3.0-flash-vl',
];

async function callChatWithFallback(
  messages: Array<{ role: 'system' | 'user'; content: string }>,
  customApiKey?: string
): Promise<string> {
  const primary = process.env.AI_MODEL_NAME || 'nvidia/nemotron-3-ultra-550b-a55b:free';
  const models = Array.from(new Set([primary, ...FALLBACK_MODELS]));
  const openai = getOpenAIClient(customApiKey);
  let lastError: unknown = null;
  let hasLimitError = false;

  for (const model of models) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages,
        max_tokens: 4000,
        temperature: 0.3,
      });
      let content = completion.choices[0]?.message?.content?.trim();
      if (content) {
        // Strip code fences if model wraps in ```markdown ... ```
        if (content.startsWith('```markdown')) {
          content = content.replace(/^```markdown\s*/i, '').replace(/\s*```$/, '').trim();
        } else if (content.startsWith('```')) {
          content = content.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '').trim();
        }
        return content;
      }
    } catch (err: any) {
      console.warn(`[Blueprint Generator] Model '${model}' failed, attempting fallback...`, err?.message || err);
      lastError = err;
      const status = err?.status || err?.statusCode;
      const msg = String(err?.message || '').toLowerCase();
      if (
        status === 402 ||
        status === 429 ||
        msg.includes('credit') ||
        msg.includes('rate limit') ||
        msg.includes('quota') ||
        msg.includes('payment') ||
        msg.includes('exceeded')
      ) {
        hasLimitError = true;
      }
    }
  }

  // If shared default endpoint was used and hit rate/credit limit, raise structured error for modal
  if (hasLimitError && !customApiKey) {
    throw new Error(
      'DEFAULT_LIMIT_REACHED: The default API endpoint has reached its limit. Please add your own endpoint.'
    );
  }

  throw new Error(`All generation models failed. Last error: ${(lastError as Error)?.message || lastError}`);
}

export interface GeneratorParams {
  prompt: string;
  techStack?: string[];
  exclusions?: string;
  complexity?: string;
  customApiKey?: string;
}

export interface GeneratedBlueprintFiles {
  projectOverview: string;
  prd: string;
  requirements?: string; // Backwards compatibility for legacy blueprints
  architecture: string;
  design: string;
  rules: string;
  executionPlan: string;
}

export interface GenerationResult {
  files: GeneratedBlueprintFiles;
  metadata: {
    title: string;
    description: string;
  };
}

// 1. Generate projectOverview.md
export async function generateProjectOverview(params: GeneratorParams): Promise<string> {
  const stackStr = params.techStack?.length ? params.techStack.join(', ') : 'Modern Full-Stack Stack (Next.js, Tailwind, Express/Node, MongoDB)';
  const exclusionsStr = params.exclusions?.trim() ? `Explicitly Exclude: ${params.exclusions}` : 'No specific exclusions noted.';
  const complexityStr = params.complexity || 'Medium';

  return await callChatWithFallback([
    {
      role: 'system',
      content: `You are an elite Software Solutions Architect. Generate an authoritative, comprehensive 'projectOverview.md' formatted in GitHub-flavored markdown for autonomous AI coding agents (Cursor, Antigravity, Claude Code).
Structure strictly with:
# [Project Title] - Project Overview
## 1. Executive Summary & Problem Solved
## 2. Target Users & Key Performance Indicators (KPIs)
## 3. Tech Stack & Architectural Decisions (Rationale for choices, trade-offs)
## 4. Repository Quickstart & Environment Setup
- Exact package manager scripts (\`pnpm install\`, \`pnpm dev\`, \`pnpm build\`)
- Complete \`.env.example\` template with all required keys and explanations
## 5. Architectural Principles (Zero-drift modularity, pragmatic engineering, testing standards)

Be direct, technically precise, and eliminate vague high-level fluff.`,
    },
    {
      role: 'user',
      content: `User Requirements Prompt:
${params.prompt}

Tech Stack Preferences: ${stackStr}
Target Complexity: ${complexityStr}
Scope Exclusions: ${exclusionsStr}`,
    },
  ], params.customApiKey);
}

// 2. Generate PRD.md (Product Requirements Document)
export async function generatePRD(
  params: GeneratorParams,
  projectOverview: string
): Promise<string> {
  return await callChatWithFallback([
    {
      role: 'system',
      content: `You are a Principal Product Architect. Generate an authoritative, deterministic 'PRD.md' (Product Requirements Document) formatted in GitHub-flavored markdown for autonomous AI coding agents.
Structure strictly with:
# Product Requirements Document (PRD)
## 1. Product Vision & Core Problem
## 2. User Personas & User Journeys (Step-by-step user flows)
## 3. Functional Epics & User Stories
Format each story as:
- **Story [ID]**: As a [user role], I want [action], so that [outcome].
## 4. Acceptance Criteria in Gherkin Syntax
Provide unambiguous Gherkin scenarios for every core story:
- Scenario: [Scenario Name]
  - Given [precondition]
  - When [action taken]
  - Then [expected deterministic outcome]
## 5. Scope Boundaries
- **In Scope (MVP)**: Strict feature checklist.
- **Out of Scope**: Explicitly forbidden features for MVP.
## 6. Edge Cases, Validation Rules & Failure Modes
Include input length constraints, authentication expiry, rate limits, and network failure fallbacks.`,
    },
    {
      role: 'user',
      content: `Project Context from Overview:
${projectOverview}

Original User Prompt:
${params.prompt}
${params.exclusions ? `Exclusions: ${params.exclusions}` : ''}`,
    },
  ], params.customApiKey);
}

// Backward compatibility wrapper for requirements.md
export async function generateRequirements(
  params: GeneratorParams,
  projectOverview: string
): Promise<string> {
  return generatePRD(params, projectOverview);
}

// 3. Generate architecture.md
export async function generateArchitecture(
  params: GeneratorParams,
  projectOverview: string,
  prd: string
): Promise<string> {
  const stackStr = params.techStack?.length ? params.techStack.join(', ') : 'Modern Full-Stack Stack (Next.js, Tailwind, Express/Node, MongoDB)';

  return await callChatWithFallback([
    {
      role: 'system',
      content: `You are a Principal Systems Architect. Generate an exact, authoritative 'architecture.md' in markdown for an autonomous AI coding agent.
DO NOT summarize when concrete code specifications are possible.
Structure strictly with:
# Architecture & System Design
## 1. System Topology & Data Flow (ASCII diagram showing Client, Server, DB, External APIs)
## 2. Directory & File Structure (Complete ASCII tree matching idiomatic conventions of the chosen tech stack: ${stackStr})
## 3. Complete Data Models & Entity Schemas
Provide FULL, copy-pasteable data models and schemas tailored to the chosen tech stack (e.g. TypeScript interfaces/Zod if TypeScript, Pydantic/dataclasses if Python, Go structs if Go, or SQL/Prisma schemas).
## 4. API Specification & Route Contracts
Provide a comprehensive table and JSON payloads:
| Method | Endpoint | Auth | Request Payload Shape | Response Payload Shape | Errors |
## 5. State Management & Architecture Boundaries
Clarify state store, caching, and execution boundaries (e.g. Server vs Client Components, or API Gateway vs Services).
## 6. Security & Authorization Architecture (Middleware rules, Session/JWT validation, RBAC matrices)`,
    },
    {
      role: 'user',
      content: `Project Overview:
${projectOverview}

PRD / Requirements:
${prd}

Selected Tech Stack: ${stackStr}`,
    },
  ], params.customApiKey);
}

// 4. Generate design.md
export async function generateDesign(
  params: GeneratorParams,
  projectOverview: string,
  architecture: string
): Promise<string> {
  return await callChatWithFallback([
    {
      role: 'system',
      content: `You are a Senior UI/UX Architect & Design Systems Lead. Generate an actionable, aesthetic 'design.md' in markdown for an autonomous AI coding agent.
Structure strictly with:
# Design System & UI Architecture
## 1. Visual Aesthetic Direction (Theme philosophy, dark/light balance, visual hierarchy)
## 2. Design Tokens & Color Palette (Strict 60-30-10 & Accessibility Rules)
- **60-30-10 Distribution**:
  - **60% Dominant Base**: Canvas background, main layout surfaces, and neutral container fills (provide exact hex & Tailwind CSS v4 variables).
  - **30% Secondary Structure**: Card containers, sidebars, headers, muted borders, and section dividers (provide exact hex & variables).
  - **10% Accent / Focus**: High-contrast CTA buttons, active state indicators, key metrics, and badges (provide exact hex & variables).
  - **Semantic Alerts**: Success, error, warning, and info alert hex codes.
- **WCAG 2.1 AA Compliance**: Strict minimum 4.5:1 contrast ratio for normal body copy; 3:1 for large headings and interactive UI controls.
- **Surface Elevation Hierarchy**: Surface-0 (canvas), Surface-1 (cards/containers), Surface-2 (modals/popovers) with subtle 1px borders.
## 3. Spatial System & Typography Hierarchy
- **8pt / 4pt Grid**: All margins, paddings, and gaps MUST follow 4px/8px multiples (p-2, p-4, gap-4). Prohibit arbitrary pixel values.
- **Type Scale**: Max 2 font families (Display + UI Sans). Proportional line-heights (\`leading-tight\` on headings, \`leading-relaxed\` on body).
## 4. Core Component Specifications & 5-State Interactive Contract
Define layout grid, navbar, hero, cards, forms, tables, and modal components with specific props.
Every clickable component (buttons, inputs, tabs) MUST define all 5 states:
1. Default
2. Hover
3. Focus-visible
4. Active / Pressed
5. Disabled (\`disabled:opacity-50 disabled:cursor-not-allowed\`)
## 5. Interactive States & Micro-interactions (Hover scales, loading skeletons, error states, toast conventions)
## 6. Responsive Breakpoints & Mobile Adaptations (Mobile-first rules for sm, md, lg, xl, 2xl)`,
    },
    {
      role: 'user',
      content: `Project Overview:
${projectOverview}

System Architecture:
${architecture}`,
    },
  ], params.customApiKey);
}

// 5. Generate rules.md (Agent Guardrails & Coding Standards)
export async function generateRules(
  params: GeneratorParams,
  projectOverview: string,
  architecture: string
): Promise<string> {
  const stackStr = params.techStack?.length ? params.techStack.join(', ') : 'Modern Full-Stack Stack';
  const exclusionsStr = params.exclusions?.trim() ? `Explicit exclusions: ${params.exclusions}` : 'None';

  return await callChatWithFallback([
    {
      role: 'system',
      content: `You are a Lead AI Workflow Architect. Generate a deterministic 'rules.md' file that serves as strict system instructions and guardrails for an AI coding agent (Cursor, Antigravity, Claude Code, Codex) to build this project without human intervention.
Calibrate all rules specifically to the selected tech stack: ${stackStr}.

Structure strictly with:
# AI Coding Rules & Operational Guardrails
## 1. Tech Stack Mandates & Ecosystem Conventions
- Strictly enforce idioms, language versions, and framework paradigms native to the chosen stack: ${stackStr}.
- Do NOT mix paradigms or force unrelated framework conventions (e.g. if Next.js App Router, ban Pages Router; if Python, follow PEP 8 and modern async patterns; if Go, follow idiomatic project layout).
## 2. Forbidden Libraries & Anti-Patterns
Explicitly list banned packages and anti-patterns that the agent MUST NOT use.
${exclusionsStr}
## 3. Idiomatic File Architecture & Modularity
- Maximum file size (e.g. 200 lines per file; aggressively modularize helper functions and components).
- Follow standard ecosystem folder conventions for ${stackStr} (e.g. separate business logic, data models, routes/actions, and UI views).
## 4. Language-Specific Type Safety & Code Quality
- If TypeScript: enforce \`strict: true\` and prohibit \`any\` or \`as unknown as ...\`.
- If Python: enforce type hints (\`typing\` / Pydantic) and zero unannotated functions.
- If JavaScript: enforce modern ES modules and strict JSDoc annotations.
- All external API request and response boundaries must be validated with runtime schemas.
## 5. Security, Secrets & Environment Variables
- Zero hardcoded secrets: Never hardcode API keys, JWT secrets, DB connection strings, or auth tokens in code.
- All secrets MUST be read from environment variables with runtime schema validation.
- Never expose private backend server credentials to client-side code.
## 6. Error Handling & Data Integrity Standard
- Unified response format: \`{ success: boolean, data?: T, error?: string, code?: string }\`.
- Fail loudly: NEVER silently fall back to mock memory arrays when a database or external API call fails.
## 7. AI Agent Self-Verification Checklist
List exact ecosystem-native sanity checks the agent must run after generating any code (lint, typecheck, build).`,
    },
    {
      role: 'user',
      content: `Project Overview:
${projectOverview}

Tech Stack:
${stackStr}

Architecture:
${architecture}`,
    },
  ], params.customApiKey);
}

// 6. Generate executionPlan.md
export async function generateExecutionPlan(
  params: GeneratorParams,
  projectOverview: string,
  prd: string,
  architecture: string,
  design: string,
  rules?: string
): Promise<string> {
  const complexityStr = params.complexity || 'Medium';

  return await callChatWithFallback([
    {
      role: 'system',
      content: `You are an Agentic Execution Lead. Generate a deterministic, phased 'executionPlan.md' formatted specifically for an AI coding agent (Cursor, Antigravity, Claude Code, Codex) to autonomously execute step-by-step.

CRITICAL RULES:
1. Calibrate Chronological Phases to Project Complexity (${complexityStr}):
   - Low Complexity / MVP: 3 to 4 focused phases (e.g. Phase 1: Environment & Base Schemas, Phase 2: Core Logic & UI, Phase 3: Integration & Polish).
   - Medium Complexity: 5 to 6 structured phases (e.g. Phase 1: Foundation & Types, Phase 2: DB Models & Services, Phase 3: UI System, Phase 4: Core Flows & Routing, Phase 5: Verification & Hardening).
   - High Complexity / Enterprise: 7 or more granular phases (e.g. Phase 1: Infra & Base Schemas, Phase 2: Auth & Role Control, Phase 3: Data Services, Phase 4: UI Engine & Layouts, Phase 5: Complex Workflows, Phase 6: Observability/Telemetry, Phase 7: End-to-End Hardening).
2. Every task MUST follow this exact actionable markdown checkbox format:
   - [ ] Task X.Y: [Verb] [Feature/Component Name]
     - Target File: \`exact/path/to/file\`
     - Description: [Precise instructions on what functions/logic to create]
     - Dependencies: [Prerequisite tasks or files]
     - Verification: \`[exact shell command or check to verify, matching the project language/runtime]\`
3. Zero dependency deadlocks: Order tasks strictly so models exist before routes/services, and routes/services exist before UI views call them.
4. Granular atomic tasks: Break complex flows into distinct sub-tasks with clear single-file focus.`,
    },
    {
      role: 'user',
      content: `Project Overview:
${projectOverview}

PRD / Requirements:
${prd}

Architecture:
${architecture}

Design System:
${design}
${rules ? `\nCoding Rules:\n${rules}` : ''}

Target Complexity: ${complexityStr}

Create the complete execution plan now.`,
    },
  ], params.customApiKey);
}

// Optimized Parallel Pipeline: Runs Step 1, then parallel Steps 2, 3, 4, 5, then Step 6
export async function generateAllBlueprintFilesOptimized(
  params: GeneratorParams
): Promise<GenerationResult> {
  // Step 1: Project Overview
  const projectOverview = await generateProjectOverview(params);

  // Step 2: PRD
  const prd = await generatePRD(params, projectOverview);

  // Step 3, 4, 5: Parallel Batch (Architecture, Design, Rules)
  const [architecture, design, rules] = await Promise.all([
    generateArchitecture(params, projectOverview, prd),
    generateDesign(params, projectOverview, 'Standard responsive UI layout based on overview.'),
    generateRules(params, projectOverview, 'Standard architectural conventions based on overview.'),
  ]);

  // Step 6: Execution Plan
  const executionPlan = await generateExecutionPlan(
    params,
    projectOverview,
    prd,
    architecture,
    design,
    rules
  );

  const files: GeneratedBlueprintFiles = {
    projectOverview,
    prd,
    requirements: prd, // Backwards compatibility
    architecture,
    design,
    rules,
    executionPlan,
  };

  const metadata = await extractBlueprintMetadata(projectOverview, 'New Software Blueprint');

  return { files, metadata };
}

// Utility: Helper to extract clean Title and Short Description from Overview
export async function extractBlueprintMetadata(
  overviewMarkdown: string,
  defaultTitle: string = 'Untitled Blueprint'
): Promise<{ title: string; description: string }> {
  let title = defaultTitle;
  let description = 'AI-generated software architecture blueprint for Agentic IDE implementation.';

  // Match first # Title
  const titleMatch = overviewMarkdown.match(/^#\s+(.*?)(?:\s+-\s+Project Overview|\s+Overview)?$/m);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  }

  // Match executive summary paragraph
  const summaryMatch = overviewMarkdown.match(/##\s+1\.\s+(?:Executive Summary|Summary)[^\n]*\n+([^#\n]+)/i);
  if (summaryMatch && summaryMatch[1]) {
    description = summaryMatch[1].trim().slice(0, 240);
  }

  return { title, description };
}

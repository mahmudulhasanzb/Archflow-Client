'use server';

import OpenAI from 'openai';

function getOpenAIClient(): OpenAI {
  const baseURL = process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1';
  const apiKey = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || '';

  return new OpenAI({
    baseURL: baseURL,
    apiKey: apiKey,
    dangerouslyAllowBrowser: false,
  });
}

const FALLBACK_MODELS = [
  'inclusionai/ling-3.0-flash-vl:free',
  'cohere/north-mini-code:free',
  'liquid/lfm-2.5-2.6b:free',
];

async function callChatWithFallback(
  messages: Array<{ role: 'system' | 'user'; content: string }>
): Promise<string> {
  const primary = process.env.AI_MODEL_NAME || 'inclusionai/ling-3.0-flash-vl:free';
  const models = Array.from(new Set([primary, ...FALLBACK_MODELS]));
  const openai = getOpenAIClient();
  let lastError: unknown = null;

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
    } catch (err: unknown) {
      console.warn(`[Blueprint Generator] Model '${model}' failed, attempting fallback...`, (err as Error)?.message || err);
      lastError = err;
    }
  }

  throw new Error(`All generation models failed. Last error: ${(lastError as Error)?.message || lastError}`);
}

export interface GeneratorParams {
  prompt: string;
  techStack?: string[];
  exclusions?: string;
  complexity?: string;
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
  ]);
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
  ]);
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
  return await callChatWithFallback([
    {
      role: 'system',
      content: `You are a Principal Systems Architect. Generate an exact, authoritative 'architecture.md' in markdown for an autonomous AI coding agent.
DO NOT summarize when concrete code specifications are possible.
Structure strictly with:
# Architecture & System Design
## 1. System Topology & Data Flow (ASCII diagram showing Client, Server, DB, External APIs)
## 2. Directory & File Structure (Complete ASCII tree matching modern conventions, e.g. Next.js 16 App Router)
## 3. Complete Data Models & TypeScript Schemas
Provide FULL, copy-pasteable TypeScript interfaces/types or Zod schemas for all database entities with relationships and indexes.
## 4. API Specification & Route Contracts
Provide a comprehensive table and JSON payloads:
| Method | Endpoint | Auth | Request Payload Shape | Response Payload Shape | Errors |
## 5. State Management & Server/Client Boundary Rules
Clarify exact boundaries between Server Components, Server Actions, and Client Components.
## 6. Security & Authorization Architecture (Middleware rules, JWT/Session validation, RBAC matrices)`,
    },
    {
      role: 'user',
      content: `Project Overview:
${projectOverview}

PRD / Requirements:
${prd}

Selected Tech Stack: ${params.techStack?.join(', ') || 'Next.js, Node, MongoDB'}`,
    },
  ]);
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
## 2. Design Tokens & Color Palette
Provide exact Tailwind CSS v4 variables / Hex color codes for primary, secondary, neutral, surface, and semantic alerts (success, error, warning).
## 3. Typography Hierarchy (Font family recommendations, type scale with rem values, font weights)
## 4. Core Component Specifications & Layouts
Define layout grid, navbar, hero, cards, forms, tables, and modal components with specific props.
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
  ]);
}

// 5. Generate rules.md (Agent Guardrails & Coding Standards)
export async function generateRules(
  params: GeneratorParams,
  projectOverview: string,
  architecture: string
): Promise<string> {
  const stackStr = params.techStack?.length ? params.techStack.join(', ') : 'Next.js, Tailwind, Node, MongoDB';
  const exclusionsStr = params.exclusions?.trim() ? `Explicit exclusions: ${params.exclusions}` : 'None';

  return await callChatWithFallback([
    {
      role: 'system',
      content: `You are a Lead AI Workflow Architect. Generate a deterministic 'rules.md' file that serves as strict system instructions and guardrails for an AI coding agent (Cursor, Antigravity, Claude Code) to build this project without human intervention.
Structure strictly with:
# AI Coding Rules & Operational Guardrails
## 1. Tech Stack Mandates & Fixed Versions
Specify exact frameworks, libraries, and language versions. Enforce strict conventions (e.g. Next.js 16 App Router only, never use Pages Router).
## 2. Forbidden Libraries & Anti-Patterns
Explicitly list banned packages and patterns that the agent MUST NOT use.
${exclusionsStr}
## 3. File Architecture & Modularity Rules
- Maximum file size (e.g. 200 lines per file; modularize components).
- File placement conventions (actions in /lib/actions, types in /types, components separated into ui vs feature).
## 4. Type Safety & Code Quality Mandates
- TypeScript \`strict: true\`. Prohibit \`any\` or \`as unknown as ...\`.
- All API payloads must use Zod or typed interfaces.
## 5. Error Handling & API Response Standard
Enforce unified response format: \`{ success: boolean, data?: T, error?: string, code?: string }\`.
## 6. AI Agent Self-Verification Checklist
List exact sanity checks the agent must run after generating any code (lint, typecheck, build).`,
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
  ]);
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
  return await callChatWithFallback([
    {
      role: 'system',
      content: `You are an Agentic Execution Lead. Generate a deterministic, phased 'executionPlan.md' formatted specifically for an AI coding agent (Cursor, Antigravity, Claude Code) to autonomously execute step-by-step.

CRITICAL RULES:
1. Divide into 5 chronological Phases:
   - Phase 1: Environment, Dependencies & Base Types
   - Phase 2: Database Models, Services & Server APIs
   - Phase 3: Core UI Components & Design System Tokens
   - Phase 4: Full Feature Integration & User Flows
   - Phase 5: Testing, Hardening & End-to-End Verification
2. Every task MUST follow this exact actionable markdown checkbox format:
   - [ ] Task X.Y: [Verb] [Feature/Component Name]
     - Target File: \`exact/path/to/file.ts\`
     - Description: [Precise instructions on what functions/logic to create]
     - Dependencies: [Prerequisite tasks or files]
     - Verification: \`[exact shell command or manual check to verify]\`
3. Zero dependency deadlocks: Order tasks strictly so models exist before routes, and routes exist before UI components call them.
4. Granular atomic tasks: No mega-tasks. Break complex flows into distinct sub-tasks.`,
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

Create the complete execution plan now.`,
    },
  ]);
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

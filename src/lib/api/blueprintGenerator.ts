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
        max_tokens: 2200,
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
  requirements: string;
  architecture: string;
  design: string;
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
      content: `You are an elite Software Solutions Architect. Generate a high-value, comprehensive 'projectOverview.md' formatted in GitHub-flavored markdown for an Agentic IDE (Cursor, Antigravity, Claude Code).
Structure strictly with:
# [Project Title] - Project Overview
## 1. Executive Summary & Problem Solved
## 2. Target Users & Value Proposition
## 3. Tech Stack & Architectural Decisions (Rationale for choices)
## 4. Repository Quickstart & Environment Setup (dev commands, port conventions, .env variables)
## 5. Architectural Principles (modularity, pragmatic engineering, testing standards)

Be direct, technically precise, and avoid fluff.`,
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

// 2. Generate requirements.md
export async function generateRequirements(
  params: GeneratorParams,
  projectOverview: string
): Promise<string> {
  return await callChatWithFallback([
    {
      role: 'system',
      content: `You are an elite Product Manager & Specification Engineer. Generate a thorough, deterministic 'requirements.md' in markdown for an Agentic IDE.
Structure strictly with:
# Requirements & Functional Specifications
## 1. Target Personas & User Journeys
## 2. Core Functional Requirements (Organized by feature with Acceptance Criteria)
## 3. Non-Functional Requirements (Security, Auth, Performance, Responsive layout)
## 4. Scope Boundaries (Strictly IN scope vs OUT of scope for MVP)
## 5. Edge Cases & Validation Rules

Be rigorous. Provide unambiguous acceptance criteria for each requirement.`,
    },
    {
      role: 'user',
      content: `Project Context from Overview:
${projectOverview}

Original Prompt:
${params.prompt}
${params.exclusions ? `Exclusions: ${params.exclusions}` : ''}`,
    },
  ]);
}

// 3. Generate architecture.md
export async function generateArchitecture(
  params: GeneratorParams,
  projectOverview: string,
  requirements: string
): Promise<string> {
  return await callChatWithFallback([
    {
      role: 'system',
      content: `You are a Principal Software Systems Architect. Generate an exact, authoritative 'architecture.md' in markdown for an Agentic IDE.
Structure strictly with:
# Architecture & System Design
## 1. High-Level Architecture & Component Map
## 2. Detailed Directory & Folder Structure (ASCII tree diagram with clear folder purposes)
## 3. Routing Map & URL Structure (Page routes, API routes, route guards)
## 4. Data Models & Entity Schemas (Fields, data types, relationships, indexes)
## 5. API Contracts & Endpoint Specifications (HTTP Methods, Request payload, Response schemas)
## 6. Engineering Conventions & State Management Rules

Ensure file paths and directory structures match standard conventions and project tech stack.`,
    },
    {
      role: 'user',
      content: `Project Overview:
${projectOverview}

Requirements:
${requirements}

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
      content: `You are a Senior UI/UX Architect & Design Systems Lead. Generate an actionable, aesthetic 'design.md' in markdown for an Agentic IDE.
Structure strictly with:
# Design System & UI Architecture
## 1. Visual Aesthetic Direction (Theme, dark/light mode, emotional tone)
## 2. Design Tokens & Color Palette (Primary, secondary, neutral, semantic alert hex codes)
## 3. Typography & Hierarchy (Font families, weight scale, leading)
## 4. Component Hierarchy & Key UI Layouts (Navbar, hero, cards, forms, modals, tables)
## 5. Interactive States & Micro-animations (Hover effects, loading skeletons, toast notifications)
## 6. Responsive Breakpoints & Mobile Adaptations`,
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

// 5. Generate executionPlan.md
export async function generateExecutionPlan(
  params: GeneratorParams,
  projectOverview: string,
  requirements: string,
  architecture: string,
  design: string
): Promise<string> {
  return await callChatWithFallback([
    {
      role: 'system',
      content: `You are an Agentic Execution Lead. Generate a deterministic, phased 'executionPlan.md' formatted specifically for an AI coding agent (Cursor, Antigravity, Claude Code) to execute task-by-step.

CRITICAL FORMATTING RULES:
1. Divide into chronological Phases (e.g. Phase 1: Setup & Data Foundation, Phase 2: Core Business Logic, Phase 3: Frontend Views, Phase 4: Integration & Flows, Phase 5: Verification).
2. Every task MUST be an actionable markdown checkbox: '- [ ] Task X.Y: [Task Name]'
3. Every task MUST specify targeted file: 'File: [path/to/file]'
4. Every task MUST specify an explicit verification check: '- Verify: [exact command or browser check]'
5. Granular sub-tasks allow the agent to execute one step at a time without guessing or getting confused.`,
    },
    {
      role: 'user',
      content: `Project Overview:
${projectOverview}

Requirements:
${requirements}

Architecture:
${architecture}

Design System:
${design}

Create the complete execution plan now.`,
    },
  ]);
}

// Optimized Parallel Pipeline: Runs Step 1, then Steps 2, 3, 4 simultaneously, then Step 5
export async function generateAllBlueprintFilesOptimized(
  params: GeneratorParams
): Promise<GenerationResult> {
  // Step 1: Project Overview
  const projectOverview = await generateProjectOverview(params);

  // Step 2, 3, 4: Parallel Batch (Requirements, Architecture, Design)
  const [requirements, architecture, design] = await Promise.all([
    generateRequirements(params, projectOverview),
    generateArchitecture(params, projectOverview, 'Standard full-stack requirements based on overview.'),
    generateDesign(params, projectOverview, 'Standard responsive UI layout based on overview.'),
  ]);

  // Step 5: Execution Plan
  const executionPlan = await generateExecutionPlan(
    params,
    projectOverview,
    requirements,
    architecture,
    design
  );

  const files: GeneratedBlueprintFiles = {
    projectOverview,
    requirements,
    architecture,
    design,
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

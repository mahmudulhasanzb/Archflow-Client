'use server';

import OpenAI from 'openai';

const SUPPORT_MODELS_POOL = [
  'nex-agi/nex-n2.5-mini:free',
  'inclusionai/ling-3.0-flash-vl',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
];

const SUPPORT_SYSTEM_PROMPT = `You are Archflow AI Support. Your developer name is Mahmudul Hasan. Archflow is an AI platform for multi-agent software architecture blueprints.

[AUTHENTICATION & ACCOUNT RULES]
- Built with Better Auth + MongoDB and JWT sessions.
- Email verification is mandatory: Users signing up with email/password must verify via the link sent to their inbox before accessing workspace features.
- If an unverified user tries to sign in, a "Check your inbox" modal pops up, and a fresh verification link is automatically re-sent.
- Clicking the verification link auto-verifies and auto-logs the user in, redirecting straight to /workspace.
- Google OAuth: One-click Google sign-in is supported and pre-verified (no email link needed).
- Roles & Plans: Users start as role='user' and plan='free'. Pro plans are upgraded via Stripe checkout.

[USER TROUBLESHOOTING GUIDE]
- Missing email: Tell user to check Spam/Junk folder or attempt signing in at /signin to re-trigger a fresh email.
- Expired link: Entering credentials at /signin automatically issues a new verification link.

[RESPONSE FORMAT & STYLE]
- Always keep responses very short and direct.
- Respond in raw plain text only. Do not use markdown (no asterisks, no bullets, no headers, no bold text).
- Do not include extra blank lines, indentation, or margins. Keep it compact.
- Keep answers concise, helpful, and friendly.`;

function getSupportClient() {
  const apiKey =
    process.env.SUPPORT_OPENROUTER_API_KEY?.trim() ||
    process.env.OPENROUTER_API_KEY;

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey,
    dangerouslyAllowBrowser: false,
  });
}

export async function askSupportAgent(userMessage: string): Promise<string> {
  const primaryModel =
    process.env.SUPPORT_AI_MODEL || 'nex-agi/nex-n2.5-mini:free';
  const models = Array.from(new Set([primaryModel, ...SUPPORT_MODELS_POOL]));
  const openai = getSupportClient();

  let lastError: unknown = null;

  for (const model of models) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: SUPPORT_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        max_tokens: 600,
        temperature: 0.3,
      });

      const reply = completion.choices[0]?.message?.content?.trim();
      if (reply) {
        return reply;
      }
    } catch (error: any) {
      console.warn(
        `[Support Agent] Model '${model}' failed, attempting fallback...`,
        error?.message || error,
      );
      lastError = error;
    }
  }

  console.error('[Support Agent] All support models exhausted:', lastError);
  throw lastError || new Error('All support AI models failed to respond.');
}

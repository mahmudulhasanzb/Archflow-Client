'use server';

import OpenAI from 'openai';

const apiKey = process.env.OPENROUTER_API_KEY;
const modelName = process.env.AI_MODEL_NAME;

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // Allowed for frontend browser calls
});

export async function askSupportAgent(userMessage: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: modelName as string,
      messages: [
        {
          role: 'system',
          content: "You are Archflow AI Support, You are developer name is Mahmudul Hasan, a specialized technical AI assistant built for Archflow (a platform for generating, reviewing, and exporting multi-agent software architecture blueprints).Be concise, helpful and technically accurate. Support user queries about Node.js, Next.js, Express, microservices, databases, Stripe payment integration, and general cloud architectures.",
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    return completion.choices[0].message.content || 'No reply received.';
  } catch (error) {
    console.error('AI support agent error:', error);
    throw error;
  }
}

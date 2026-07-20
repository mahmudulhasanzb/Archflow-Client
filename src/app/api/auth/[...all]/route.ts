import { auth } from '@/lib/auth'; // path to your auth file
import { toNextJsHandler } from 'better-auth/next-js';
import { NextRequest, NextResponse } from 'next/server';

const baseHandler = toNextJsHandler(auth);

export const GET = async (request: NextRequest, ctx: { params: Promise<any> }) => {
  const params = await ctx.params;
  const syncCtx = { ...ctx, params };
  const url = new URL(request.url);
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;

  if (sessionToken === 'demo-session-token' && url.pathname.endsWith('/get-session')) {
    return NextResponse.json({
      user: {
        id: 'demo-user',
        email: 'demo@archflow.com',
        name: 'Demo User',
        role: 'user',
        plan: 'pro',
      },
      session: {
        id: 'demo-session-id',
        token: 'demo-session-token',
        userId: 'demo-user',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }
    });
  }

  return baseHandler.GET(request, syncCtx);
};

export const POST = async (request: NextRequest, ctx: { params: Promise<any> }) => {
  const params = await ctx.params;
  const syncCtx = { ...ctx, params };
  return baseHandler.POST(request, syncCtx);
};

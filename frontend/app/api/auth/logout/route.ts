import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { ironSessionOptions } from '@/lib/ironSessionOptions';

export async function POST(request: NextRequest) {
  const res = new Response();
  const session = await getIronSession(request, res, ironSessionOptions);
  await session.destroy();
  return NextResponse.json({ success: true, message: 'Logged out' });
} 
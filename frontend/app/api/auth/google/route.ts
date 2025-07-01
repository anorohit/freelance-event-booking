import { NextRequest, NextResponse } from 'next/server';
import { setupGoogleStrategy } from '@/lib/passport/google';

setupGoogleStrategy();

export async function GET(request: NextRequest) {
  // Start Google OAuth flow
  const url = new URL(request.url);
  const callbackUrl = `${url.origin}/api/auth/google/callback`;
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${callbackUrl}` +
    `&response_type=code` +
    `&scope=profile email`;
  return NextResponse.redirect(authUrl);
} 
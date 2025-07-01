import { NextRequest, NextResponse } from 'next/server';
import { withDB } from '@/lib/withDB';
import { getIronSession, IronSession } from 'iron-session';
import { ironSessionOptions, SessionUser } from '@/lib/ironSessionOptions';
import { User } from '@/models/User';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL as string;

export const GET = withDB(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) {
    return NextResponse.json({ success: false, error: 'No code provided' }, { status: 400 });
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_CALLBACK_URL,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.json({ success: false, error: 'Failed to get tokens' }, { status: 400 });
  }
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Fetch user profile from Google
  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!profileRes.ok) {
    return NextResponse.json({ success: false, error: 'Failed to get user profile' }, { status: 400 });
  }
  const profile = await profileRes.json();

  // Find or create user in DB
  let user = await User.findOne({ email: profile.email });
  if (!user) {
    user = await User.create({
      name: profile.name,
      email: profile.email,
      isGoogleUser: true,
      role: 'user',
    });
  }

  // Save user info in session
  const url = new URL(request.url);
  const response = NextResponse.redirect(url.origin + '/');
  const session = await getIronSession(request, response, ironSessionOptions) as IronSession<{ user?: SessionUser }>;
  session.user = {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt ? user.createdAt.toISOString() : undefined,
  };
  await session.save();
  return response;
});  
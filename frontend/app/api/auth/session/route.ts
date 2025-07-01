import { NextRequest, NextResponse } from 'next/server';
import { getIronSession, IronSession } from 'iron-session';
import { ironSessionOptions, SessionUser } from '@/lib/ironSessionOptions';
import { User } from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const res = new Response();
    const session = await getIronSession(request, res, ironSessionOptions) as IronSession<{ user?: SessionUser }>;
    if (session.user) {
      // Always fetch the latest user info from the database
      const user = await User.findById(session.user._id);
      if (!user) {
        return NextResponse.json({ loggedIn: false, user: null });
      }
      return NextResponse.json({
        loggedIn: true,
        user: {
          _id: String(user._id),
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt ? user.createdAt.toISOString() : undefined,
        },
      });
    } else {
      return NextResponse.json({ loggedIn: false, user: null });
    }
  } catch (e) {
    return NextResponse.json({ loggedIn: false, user: null });
  }
} 
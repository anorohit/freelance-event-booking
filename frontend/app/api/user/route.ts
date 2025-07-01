import { NextRequest, NextResponse } from 'next/server';
import { withDB } from '@/lib/withDB';
import { getIronSession, IronSession } from 'iron-session';
import { ironSessionOptions, SessionUser } from '@/lib/ironSessionOptions';
import { User } from '@/models/User';

export const PATCH = withDB(async (request: NextRequest) => {
  const res = new Response();
  const session = await getIronSession(request, res, ironSessionOptions) as IronSession<{ user?: SessionUser }>;
  if (!session.user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const { name, phone } = await request.json();
  if (!name && !phone) {
    return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
  }

  const update: any = {};
  if (name) update.name = name;
  if (phone) update.phone = phone;

  const user = await User.findByIdAndUpdate(
    session.user._id,
    update,
    { new: true }
  );
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  // Update session with new info
  session.user = {
    ...session.user,
    name: user.name,
    phone: user.phone,
  } as any;
  await session.save();

  return NextResponse.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt } });
}); 
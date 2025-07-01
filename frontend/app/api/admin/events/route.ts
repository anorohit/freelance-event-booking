import { NextRequest, NextResponse } from 'next/server';
import { withDB } from '@/lib/withDB';
import { Event } from '@/models/Event';

// GET /api/admin/events - List all events
export const GET = withDB(async (request: NextRequest) => {
  const events = await Event.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: events });
});

// POST /api/admin/events - Create a new event (no Zod validation)
export const POST = withDB(async (request: NextRequest) => {
  const body = await request.json();
  try {
    const event = await Event.create(body);
    return NextResponse.json({ success: true, data: event });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}); 
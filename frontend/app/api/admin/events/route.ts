import { NextRequest, NextResponse } from 'next/server';
import { withDB } from '@/lib/withDB';
import { Event, eventSchemaZod } from '@/models/Event';

// GET /api/admin/events - List all events
export const GET = withDB(async (request: NextRequest) => {
  const events = await Event.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: events });
});

// POST /api/admin/events - Create a new event
export const POST = withDB(async (request: NextRequest) => {
  const body = await request.json();
  // Validate with Zod
  const parse = eventSchemaZod.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ success: false, error: parse.error.errors }, { status: 400 });
  }
  const event = await Event.create(parse.data);
  return NextResponse.json({ success: true, data: event });
}); 
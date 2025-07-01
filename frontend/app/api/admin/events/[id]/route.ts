import { NextRequest, NextResponse } from 'next/server';
import { withDB } from '@/lib/withDB';
import { Event } from '@/models/Event';

// PATCH /api/admin/events/[id] - Update only provided fields
export const PATCH = withDB(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = await params;
  const body = await request.json();
  // Remove undefined fields from body
  const update: Record<string, any> = {};
  Object.keys(body).forEach(key => {
    if (body[key] !== undefined) update[key] = body[key];
  });
  const event = await Event.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
  if (!event) {
    return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: event });
});

// DELETE /api/admin/events/[id] - Delete an event
export const DELETE = withDB(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = await params;
  const event = await Event.findByIdAndDelete(id);
  if (!event) {
    return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Event deleted' });
}); 
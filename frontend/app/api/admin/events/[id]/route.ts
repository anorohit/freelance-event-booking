import { NextRequest, NextResponse } from 'next/server';
import { withDB } from '@/lib/withDB';
import { Event } from '@/models/Event';

// PATCH /api/admin/events/[id] - Update an event
export const PATCH = withDB(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const body = await request.json();
  const event = await Event.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!event) {
    return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: event });
});

// DELETE /api/admin/events/[id] - Delete an event
export const DELETE = withDB(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const event = await Event.findByIdAndDelete(id);
  if (!event) {
    return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Event deleted' });
}); 
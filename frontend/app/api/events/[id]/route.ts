import { NextRequest, NextResponse } from 'next/server';
import { withDB } from '@/lib/withDB';
import Event from '@/models/Event';

// GET /api/events/[id] - Get a specific event
export const GET = withDB(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const event = await Event.findById(params.id);
  
  if (!event) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Event not found' 
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: event
  });
});

// PUT /api/events/[id] - Update a specific event
export const PUT = withDB(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const body = await request.json();
  
  // Validate required fields
  const requiredFields = ['title', 'location', 'date', 'time'];
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { 
          success: false, 
          error: `${field} is required` 
        },
        { status: 400 }
      );
    }
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    params.id,
    {
      title: body.title,
      location: body.location,
      date: body.date,
      time: body.time,
      description: body.description || '',
      // Add more fields as needed
    },
    { new: true, runValidators: true }
  );

  if (!updatedEvent) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Event not found' 
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: updatedEvent,
    message: 'Event updated successfully'
  });
});

// DELETE /api/events/[id] - Delete a specific event
export const DELETE = withDB(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const deletedEvent = await Event.findByIdAndDelete(params.id);

  if (!deletedEvent) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Event not found' 
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Event deleted successfully'
  });
}); 
import { NextRequest, NextResponse } from 'next/server';
import { withDB } from '@/lib/withDB';
import Event from '@/models/Event';

// GET /api/events - Get all events
export const GET = withDB(async (request: NextRequest) => {
  // Get query parameters for filtering
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const limit = searchParams.get('limit');

  // Build query
  let query: any = {};
  
  if (category && category !== 'all') {
    query.category = category;
  }
  
  if (status) {
    query.status = status;
  }

  // Execute query
  let eventsQuery = Event.find(query);
  
  if (limit) {
    eventsQuery = eventsQuery.limit(parseInt(limit));
  }

  const events = await eventsQuery.exec();

  return NextResponse.json({
    success: true,
    data: events,
    total: events.length
  });
});

// POST /api/events - Create a new event
export const POST = withDB(async (request: NextRequest) => {
  // Parse request body
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

  // Create new event
  const newEvent = new Event({
    title: body.title,
    location: body.location,
    date: body.date,
    time: body.time,
    description: body.description || '',
    // Add more fields as needed
  });

  // Save to database
  const savedEvent = await newEvent.save();

  return NextResponse.json({
    success: true,
    data: savedEvent,
    message: 'Event created successfully'
  }, { status: 201 });
}); 
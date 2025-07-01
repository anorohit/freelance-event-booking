import { NextRequest, NextResponse } from 'next/server';
import { withDB } from '@/lib/withDB';
import { PopularCity } from '@/models/AdminSettings';

// GET: List all popular cities
export const GET = withDB(async () => {
  const cities = await PopularCity.find();
  return NextResponse.json({ success: true, data: cities });
});

// POST: Add a new popular city
export const POST = withDB(async (request: NextRequest) => {
  const city = await request.json();
  const exists = await PopularCity.findOne({ id: city.id });
  if (exists) {
    return NextResponse.json({ success: false, message: 'City already exists' }, { status: 400 });
  }
  const newCity = await PopularCity.create(city);
  return NextResponse.json({ success: true, data: newCity });
});

// DELETE: Remove a city by id
export const DELETE = withDB(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get('id');
  if (!cityId) {
    return NextResponse.json({ success: false, message: 'City id required' }, { status: 400 });
  }
  await PopularCity.deleteOne({ id: cityId });
  return NextResponse.json({ success: true });
}); 
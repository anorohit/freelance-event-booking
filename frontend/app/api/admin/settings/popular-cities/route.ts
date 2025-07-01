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
  // Validate required fields
  if (!city.name || !city.stateCode || !city.countryCode) {
    return NextResponse.json({ success: false, message: 'Missing required fields: name, stateCode, countryCode' }, { status: 400 });
  }
  const id = `${city.name.toLowerCase().replace(/\s+/g, '-')}-${city.stateCode}`;
  const exists = await PopularCity.findOne({ id });
  if (exists) {
    return NextResponse.json({ success: false, message: 'City already exists' }, { status: 400 });
  }
  const newCity = await PopularCity.create({
    id,
    name: city.name,
    stateCode: city.stateCode,
    countryCode: city.countryCode,
    latitude: city.latitude,
    longitude: city.longitude
  });
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
import { NextRequest, NextResponse } from 'next/server';
import { withDB } from '@/lib/withDB';
import { AdminSettings } from '@/models/AdminSettings';

// GET: Fetch admin settings
export const GET = withDB(async () => {
  let settings = await AdminSettings.findOne();
  if (!settings) {
    settings = await AdminSettings.create({});
  }
  return NextResponse.json({ success: true, data: settings });
});

// PATCH: Update admin settings (section visibility, maintenance, etc.)
export const PATCH = withDB(async (request: NextRequest) => {
  const updates = await request.json();
  let settings = await AdminSettings.findOne();
  if (!settings) {
    settings = await AdminSettings.create({});
  }
  Object.keys(updates).forEach((key) => {
    settings[key] = updates[key];
  });
  await settings.save();
  return NextResponse.json({ success: true, data: settings });
});

// --- Popular Cities API ---
import { PopularCity } from '@/models/AdminSettings';

// GET /api/admin/settings/popular-cities
export async function GET_popularCities() {
  await withDB(async () => {}); // Ensure DB connection
  const cities = await PopularCity.find();
  return NextResponse.json({ success: true, data: cities });
}

// POST /api/admin/settings/popular-cities
export async function POST_popularCities(request: NextRequest) {
  await withDB(async () => {}); // Ensure DB connection
  const city = await request.json();
  // Prevent duplicates by id
  const exists = await PopularCity.findOne({ id: city.id });
  if (exists) {
    return NextResponse.json({ success: false, message: 'City already exists' }, { status: 400 });
  }
  const newCity = await PopularCity.create(city);
  return NextResponse.json({ success: true, data: newCity });
}

// DELETE /api/admin/settings/popular-cities?id=cityId
export async function DELETE_popularCities(request: NextRequest) {
  await withDB(async () => {}); // Ensure DB connection
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get('id');
  if (!cityId) {
    return NextResponse.json({ success: false, message: 'City id required' }, { status: 400 });
  }
  await PopularCity.deleteOne({ id: cityId });
  return NextResponse.json({ success: true });
} 
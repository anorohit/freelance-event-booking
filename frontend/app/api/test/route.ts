import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';

// GET /api/test - Test database connection
export async function GET() {
  try {
    // Test database connection
    await dbConnect();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from './mongoose';

// Middleware wrapper for database connection
export function withDB(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    try {
      // Connect to database
      await dbConnect();
      
      // Call the original handler
      return await handler(request, context);
      
    } catch (error: any) {
      console.error('Database connection error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed',
          details: error.message 
        },
        { status: 500 }
      );
    }
  };
} 
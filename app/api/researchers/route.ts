import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

/**
 * GET /api/researchers
 * Fetch all researchers who have created profiles
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const researchers = db.getAll();

    console.log(`📋 Fetched ${researchers.length} researcher profiles`);

    return NextResponse.json({
      success: true,
      data: researchers,
      metadata: {
        total: researchers.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error fetching researchers:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

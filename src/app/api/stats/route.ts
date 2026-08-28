import { NextRequest, NextResponse } from 'next/server';
import { serverStatsService } from '@/lib/serverStatsService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await serverStatsService.getStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const metric = body.metric || 'tiktok';

    await serverStatsService.incrementMetric(metric, 1);
    const updatedStats = await serverStatsService.getStats();

    return NextResponse.json({
      success: true,
      data: updatedStats,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { serverAdminService } from '@/lib/serverAdminService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const [overview, webUsers, telegramUsers, media] = await Promise.all([
      serverAdminService.getOverview(),
      serverAdminService.getWebUsers(100),
      serverAdminService.getTelegramUsers(100),
      serverAdminService.getMedia(100),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview,
        webUsers,
        telegramUsers,
        media,
      },
    });
  } catch (error: any) {
    console.error('[AdminStatsAPI] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Server Error',
    }, { status: 500 });
  }
}

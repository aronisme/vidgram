import { NextRequest, NextResponse } from 'next/server';
import { telegramService } from '@/lib/telegramService';

/**
 * Endpoint to easily register or delete the Telegram Webhook
 * Usage:
 * - GET /api/telegram/setup -> Registers webhook to https://vidgram.web.id/api/telegram
 * - GET /api/telegram/setup?action=delete -> Deletes webhook (enables long polling)
 * - GET /api/telegram/setup?url=https://custom-url/api/telegram -> Custom webhook URL
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const customUrl = searchParams.get('url');

    if (action === 'delete') {
      await telegramService.deleteWebhook();
      return NextResponse.json({
        success: true,
        message: 'Telegram Webhook berhasil dihapus (Mode Polling aktif).',
      });
    }

    const defaultBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vidgram.web.id';
    const targetWebhookUrl = customUrl || `${defaultBaseUrl}/api/telegram`;

    const result = await telegramService.setWebhook(targetWebhookUrl);
    const webhookInfo = await telegramService.getWebhookInfo();

    return NextResponse.json({
      success: true,
      message: `Webhook berhasil didaftarkan ke: ${targetWebhookUrl}`,
      result,
      webhookInfo,
    });
  } catch (error: any) {
    console.error('[telegramSetup] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

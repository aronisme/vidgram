import { NextRequest, NextResponse } from 'next/server';
import { telegramService } from '@/lib/telegramService';
import { getTikTokMedia } from '@/lib/tiktokDownloader';
import { serverStatsService } from '@/lib/serverStatsService';

// Helper to format numbers (e.g. 12500 -> 12.5K)
function formatNumber(num: number): string {
  if (!num || isNaN(num)) return '0';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
}

// Extract URLs from text
function extractTikTokUrl(text: string): string | null {
  const match = text.match(/https?:\/\/(?:www\.|vt\.|vm\.|t\.)?tiktok\.com\/[^\s]+/i);
  return match ? match[0] : null;
}

function extractInstagramUrl(text: string): string | null {
  const match = text.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9-_]+)/i);
  return match ? match[0] : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Handle Callback Queries (Inline button clicks)
    if (body.callback_query) {
      const cb = body.callback_query;
      const data = cb.data as string;
      const chatId = cb.message?.chat?.id;

      if (cb.from) {
        await serverStatsService.recordTelegramUser(cb.from);
      }

      if (data && data.startsWith('dl_audio:')) {
        const audioUrl = data.replace('dl_audio:', '');
        await telegramService.answerCallbackQuery(cb.id, '🎵 Mengirim file audio MP3...');
        if (chatId && audioUrl) {
          await telegramService.sendChatAction(chatId, 'upload_document');
          await telegramService.sendAudio(chatId, audioUrl, {
            title: 'TikTok Audio Track',
            performer: 'TikTok',
            caption: '🎵 <b>Audio MP3</b> diekstrak via @TiktokDownloader22bot',
            parse_mode: 'HTML',
          });
          await serverStatsService.incrementMetric('mp3');
        }
      } else {
        await telegramService.answerCallbackQuery(cb.id);
      }

      return NextResponse.json({ ok: true });
    }

    // 2. Handle standard Messages
    const message = body.message || body.edited_message;
    if (!message || !message.chat) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text?.trim() || '';
    const firstName = message.from?.first_name || 'Teman';

    // Record Telegram User stats
    if (message.from) {
      await serverStatsService.recordTelegramUser(message.from);
    }

    // Command: /start
    if (text === '/start') {
      const welcomeText = `
👋 <b>Halo, ${firstName}!</b> Selamat datang di <b>Vidgram TikTok Downloader Bot</b> 🎬

Kirimkan tautan (link) video TikTok atau Instagram ke bot ini, dan bot akan langsung mengirimkan videonya dalam kualitas HD <b>tanpa watermark</b>!

🌟 <b>Fitur Utama:</b>
• 🎥 Video TikTok No Watermark (HD)
• 🎵 Ekstraksi Musik & Audio MP3
• 📸 TikTok Slide / Album Foto
• ⚡ Download Cepat & Gratis Tanpa Batas

👉 <i>Cukup tempelkan link TikTok Anda di sini sekarang!</i>
`.trim();

      await telegramService.sendMessage(chatId, welcomeText, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🌐 Kunjungi Website Vidgram', url: 'https://www.vidgram.web.id' },
            ],
            [
              { text: '✨ Coba AI Video Upscaler', url: 'https://www.vidgram.web.id/ai-video-upscaler' }
            ]
          ]
        }
      });
      return NextResponse.json({ ok: true });
    }

    // Command: /help
    if (text === '/help') {
      const helpText = `
📖 <b>Panduan Penggunaan Bot:</b>

1. Buka aplikasi <b>TikTok</b> atau <b>Instagram</b>.
2. Temukan video/reels yang ingin Anda simpan.
3. Klik tombol <b>Bagikan (Share)</b> -> pilih <b>Salin Tautan (Copy Link)</b>.
4. Kirim link tersebut ke chat bot ini.
5. Bot akan langsung membalas dengan file video yang siap diputar atau disimpan ke galeri ponsel Anda.

Jika ada kendala, kunjungi portal kami di <a href="https://www.vidgram.web.id">Vidgram.web.id</a>.
`.trim();

      await telegramService.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
      return NextResponse.json({ ok: true });
    }

    // 3. Process TikTok URL
    const tiktokUrl = extractTikTokUrl(text);
    if (tiktokUrl) {
      await telegramService.sendChatAction(chatId, 'upload_video');
      const statusMsg = await telegramService.sendMessage(
        chatId,
        '⏳ <b>Sedang mengunduh & memproses video TikTok...</b>',
        { parse_mode: 'HTML', reply_to_message_id: message.message_id }
      );

      try {
        const media = await getTikTokMedia(tiktokUrl);

        // Record metrics atomically
        await serverStatsService.incrementMetric('tiktok');

        // Case A: TikTok Photo Album / Slides
        if (media.is_image && media.images && media.images.length > 0) {
          const mediaGroup = media.images.slice(0, 10).map((imgUrl, idx) => ({
            type: 'photo' as const,
            media: imgUrl,
            caption: idx === 0 ? `📸 <b>${media.title || 'TikTok Slides'}</b>\n👤 @${media.author.nickname}` : undefined,
            parse_mode: 'HTML' as const,
          }));

          await telegramService.sendMediaGroup(chatId, mediaGroup, message.message_id);

          // If there's background music, send audio too
          if (media.music) {
            await telegramService.sendAudio(chatId, media.music, {
              title: media.title || 'TikTok Sound',
              performer: `@${media.author.nickname}`,
              caption: '🎵 Musik latar TikTok',
              reply_to_message_id: message.message_id,
            });
            await serverStatsService.incrementMetric('mp3');
          }

          if (statusMsg?.message_id) {
            await telegramService.deleteMessage(chatId, statusMsg.message_id);
          }

          return NextResponse.json({ ok: true });
        }

        // Case B: TikTok Video
        const caption = `
🎬 <b>${media.title || 'TikTok Video'}</b>

👤 <b>Kreator:</b> @${media.author.nickname}
❤️ <b>Likes:</b> ${formatNumber(media.statistics.digg_count)}  |  💬 <b>Komentar:</b> ${formatNumber(media.statistics.comment_count)}  |  🔁 <b>Shares:</b> ${formatNumber(media.statistics.share_count)}

⚡ <i>Diunduh tanpa watermark via @TiktokDownloader22bot</i>
`.trim();

        const inlineKeyboard = [];
        if (media.music) {
          inlineKeyboard.push([
            { text: '🎵 Unduh Audio (MP3)', url: media.music }
          ]);
        }
        inlineKeyboard.push([
          { text: '🌐 Buka di Web Vidgram', url: 'https://www.vidgram.web.id/tiktok-downloader' }
        ]);

        await telegramService.sendVideo(chatId, media.play, {
          caption,
          parse_mode: 'HTML',
          reply_to_message_id: message.message_id,
          reply_markup: {
            inline_keyboard: inlineKeyboard,
          }
        });

        // Delete temporary status message
        if (statusMsg?.message_id) {
          await telegramService.deleteMessage(chatId, statusMsg.message_id);
        }

        return NextResponse.json({ ok: true });
      } catch (err: any) {
        console.error('[telegramWebhook] TikTok processing error:', err);
        if (statusMsg?.message_id) {
          await telegramService.editMessageText(
            chatId,
            statusMsg.message_id,
            `❌ <b>Gagal memproses video TikTok.</b>\n\n<i>Penyebab:</i> ${err.message || 'URL tidak valid atau video bersifat privat.'}`,
            { parse_mode: 'HTML' }
          );
        }
        return NextResponse.json({ ok: true });
      }
    }

    // 4. Process Instagram URL (Bonus Integration)
    const igUrl = extractInstagramUrl(text);
    if (igUrl) {
      await telegramService.sendChatAction(chatId, 'upload_video');
      const statusMsg = await telegramService.sendMessage(
        chatId,
        '⏳ <b>Sedang memproses tautan Instagram...</b>',
        { parse_mode: 'HTML', reply_to_message_id: message.message_id }
      );

      try {
        const { instagramGetUrl } = await import('instagram-url-direct');
        const igData = await instagramGetUrl(igUrl);

        if (igData && igData.results_number > 0) {
          await serverStatsService.incrementMetric('instagram');

          const mediaDetails = igData.media_details;
          const postInfo = igData.post_info;
          const isVideo = mediaDetails[0]?.type === 'video';
          const targetMediaUrl = mediaDetails[0]?.url;

          const caption = `
📸 <b>Instagram ${isVideo ? 'Reels' : 'Post'}</b>
👤 <b>Akun:</b> @${postInfo?.owner_username || 'instagram_user'}
💬 <i>${postInfo?.caption ? postInfo.caption.slice(0, 150) + '...' : ''}</i>

⚡ <i>Diunduh via @TiktokDownloader22bot</i>
`.trim();

          if (isVideo) {
            await telegramService.sendVideo(chatId, targetMediaUrl, {
              caption,
              parse_mode: 'HTML',
              reply_to_message_id: message.message_id,
              reply_markup: {
                inline_keyboard: [[{ text: '🌐 Instagram Pro Web', url: 'https://www.vidgram.web.id/instagram-downloader' }]]
              }
            });
          } else {
            await telegramService.sendPhoto(chatId, targetMediaUrl, {
              caption,
              parse_mode: 'HTML',
              reply_to_message_id: message.message_id,
            });
          }

          if (statusMsg?.message_id) {
            await telegramService.deleteMessage(chatId, statusMsg.message_id);
          }
          return NextResponse.json({ ok: true });
        }
      } catch (igErr: any) {
        console.warn('[telegramWebhook] Instagram direct fetch failed:', igErr.message);
      }

      if (statusMsg?.message_id) {
        await telegramService.editMessageText(
          chatId,
          statusMsg.message_id,
          '❌ <i>Gagal mengambil media Instagram. Pastikan akun tidak diprivat.</i>',
          { parse_mode: 'HTML' }
        );
      }
      return NextResponse.json({ ok: true });
    }

    // 5. Default Response for non-URL messages
    await telegramService.sendMessage(
      chatId,
      '💡 <b>Kirimkan tautan TikTok atau Instagram yang valid.</b>\nContoh:\n<code>https://vt.tiktok.com/ZSjX.../</code>',
      { parse_mode: 'HTML', reply_to_message_id: message.message_id }
    );

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error('[telegramWebhook] Error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

/**
 * Health check & status endpoint
 */
export async function GET() {
  try {
    const me = await telegramService.getMe();
    const webhook = await telegramService.getWebhookInfo();

    return NextResponse.json({
      status: 'online',
      bot: {
        id: me.id,
        name: me.first_name,
        username: me.username,
      },
      webhook: {
        url: webhook.url || 'Not set (polling mode)',
        has_custom_certificate: webhook.has_custom_certificate,
        pending_update_count: webhook.pending_update_count,
        last_error_message: webhook.last_error_message || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    }, { status: 500 });
  }
}

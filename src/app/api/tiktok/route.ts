import { NextResponse } from 'next/server';
import { getTikTokMedia } from '@/lib/tiktokDownloader';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const data = await getTikTokMedia(url);

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        title: data.title,
        cover: data.cover,
        play: data.play,
        wmplay: data.wmplay,
        music: data.music,
        author: data.author,
        statistics: data.statistics,
        images: data.images,
        is_image: data.is_image,
      }
    });
  } catch (error: any) {
    console.error('TikTok API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

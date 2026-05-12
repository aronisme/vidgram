import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.code !== 0) {
      return NextResponse.json({ error: data.msg || 'Failed to fetch TikTok video' }, { status: 400 });
    }

    // Return the processed data
    return NextResponse.json({
      success: true,
      data: {
        title: data.data.title,
        cover: data.data.cover,
        play: data.data.play, // Video without watermark
        music: data.data.music,
        author: data.data.author,
        statistics: data.data.statistics,
      }
    });
  } catch (error) {
    console.error('TikTok API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

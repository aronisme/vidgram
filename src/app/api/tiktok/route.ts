import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Modern TikWM API call using FormData as it's often more reliable for their backend
    const formData = new URLSearchParams();
    formData.append('url', url);
    formData.append('hd', '1');

    const response = await fetch('https://www.tikwm.com/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 0) {
      return NextResponse.json({ error: data.msg || 'Failed to fetch TikTok video. Please make sure the URL is correct.' }, { status: 400 });
    }

    // Return the processed data
    return NextResponse.json({
      success: true,
      data: {
        id: data.data.id,
        title: data.data.title,
        cover: data.data.cover,
        play: data.data.play, // Video without watermark
        wmplay: data.data.wmplay, // Video with watermark (backup)
        music: data.data.music,
        author: data.data.author,
        statistics: data.data.statistics,
      }
    });
  } catch (error: any) {
    console.error('TikTok API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

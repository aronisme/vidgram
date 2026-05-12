import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');
  const filename = searchParams.get('name') || 'tiktok-video.mp4';

  if (!videoUrl) {
    return new Response('Missing video URL', { status: 400 });
  }

  try {
    const videoResponse = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    
    return new NextResponse(videoBlob, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}.mp4"`,
      },
    });
  } catch (error: any) {
    console.error('Download Proxy Error:', error);
    return new Response('Error downloading video', { status: 500 });
  }
}

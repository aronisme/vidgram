import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mediaUrl = searchParams.get('url');
  const filename = searchParams.get('name') || 'vidgram-instagram';
  const type = searchParams.get('type') || 'video';

  if (!mediaUrl) {
    return new Response('Media URL is required', { status: 400 });
  }

  try {
    const mediaResponse = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      next: { revalidate: 0 }
    });

    if (!mediaResponse.ok) {
      throw new Error(`Failed to fetch media from CDN: ${mediaResponse.statusText}`);
    }

    const mediaBlob = await mediaResponse.blob();
    const extension = type === 'video' ? 'mp4' : 'jpg';
    const contentType = type === 'video' ? 'video/mp4' : 'image/jpeg';
    
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'no-store, max-age=0',
    };

    // Only set attachment header if not a preview request
    if (filename !== 'preview') {
      const safeFilename = filename
        .replace(/[^a-zA-Z0-9-_]/g, '')
        .substring(0, 80);
      headers['Content-Disposition'] = `attachment; filename="${safeFilename}.${extension}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}.${extension}`;
    }

    return new NextResponse(mediaBlob, { headers });
  } catch (error: any) {
    console.error('Instagram Download Proxy Error:', error);
    return new Response('Error downloading Instagram media file', { status: 500 });
  }
}

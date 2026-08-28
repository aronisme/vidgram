export interface TikTokMediaResult {
  id: string;
  title: string;
  cover: string;
  play: string;
  wmplay?: string;
  music?: string;
  music_info?: {
    id?: string;
    title?: string;
    author?: string;
    play?: string;
    duration?: number;
  };
  author: {
    id?: string;
    unique_id?: string;
    nickname: string;
    avatar: string;
  };
  statistics: {
    play_count: number;
    download_count: number;
    share_count: number;
    comment_count: number;
    digg_count: number;
  };
  images?: string[];
  is_image: boolean;
}

/**
 * Extract TikTok video, music, or photo slide media using resilient API extraction.
 */
export async function getTikTokMedia(url: string): Promise<TikTokMediaResult> {
  if (!url || !url.trim()) {
    throw new Error('URL TikTok wajib diisi');
  }

  // Sanitize URL
  const trimmedUrl = url.trim();

  // Primary Method: TikWM HD API
  try {
    const formData = new URLSearchParams();
    formData.append('url', trimmedUrl);
    formData.append('hd', '1');

    const response = await fetch('https://www.tikwm.com/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: formData.toString(),
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`TikWM HTTP error status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code === 0 && data.data) {
      const isImage = Array.isArray(data.data.images) && data.data.images.length > 0;

      return {
        id: data.data.id || String(Date.now()),
        title: data.data.title || 'TikTok Video',
        cover: data.data.cover || '',
        play: data.data.hdplay || data.data.play || '',
        wmplay: data.data.wmplay || '',
        music: data.data.music || data.data.music_info?.play || '',
        music_info: data.data.music_info || {
          title: data.data.title,
          author: data.data.author?.nickname,
          play: data.data.music,
        },
        author: {
          id: data.data.author?.id,
          unique_id: data.data.author?.unique_id,
          nickname: data.data.author?.nickname || 'TikTok Creator',
          avatar: data.data.author?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=TikTok',
        },
        statistics: {
          play_count: Number(data.data.play_count || 0),
          download_count: Number(data.data.download_count || 0),
          share_count: Number(data.data.share_count || 0),
          comment_count: Number(data.data.comment_count || 0),
          digg_count: Number(data.data.digg_count || 0),
        },
        images: isImage ? data.data.images : undefined,
        is_image: isImage,
      };
    }

    if (data.msg) {
      throw new Error(data.msg);
    }
  } catch (err: any) {
    console.warn('[tiktokDownloader] Primary TikWM failed, attempting fallback...', err.message);
  }

  // Fallback Method: Alternative TikWM endpoint without HD parameter
  try {
    const fallbackRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(trimmedUrl)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 0 },
    });

    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      if (fallbackData.code === 0 && fallbackData.data) {
        const isImage = Array.isArray(fallbackData.data.images) && fallbackData.data.images.length > 0;
        return {
          id: fallbackData.data.id || String(Date.now()),
          title: fallbackData.data.title || 'TikTok Video',
          cover: fallbackData.data.cover || '',
          play: fallbackData.data.play || '',
          wmplay: fallbackData.data.wmplay || '',
          music: fallbackData.data.music || '',
          author: {
            nickname: fallbackData.data.author?.nickname || 'TikTok Creator',
            avatar: fallbackData.data.author?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=TikTok',
          },
          statistics: {
            play_count: Number(fallbackData.data.play_count || 0),
            download_count: Number(fallbackData.data.download_count || 0),
            share_count: Number(fallbackData.data.share_count || 0),
            comment_count: Number(fallbackData.data.comment_count || 0),
            digg_count: Number(fallbackData.data.digg_count || 0),
          },
          images: isImage ? fallbackData.data.images : undefined,
          is_image: isImage,
        };
      }
    }
  } catch (e: any) {
    console.error('[tiktokDownloader] Fallback failed:', e.message);
  }

  throw new Error('Gagal mengambil data video TikTok. Pastikan URL video publik dan coba lagi.');
}

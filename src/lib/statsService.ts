export interface PlatformStats {
  tiktokDownloads: number;
  instagramDownloads: number;
  mp3Downloads: number;
  totalUsers: number;
  telegramUsers: number;
  totalRequests: number;
}

export const statsService = {
  /**
   * Get 100% Real Live Statistics directly from the API & Firestore
   */
  async getDownloadStats(): Promise<PlatformStats> {
    try {
      const res = await fetch('/api/stats', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('[statsService] Error fetching stats:', e);
    }

    return {
      tiktokDownloads: 0,
      instagramDownloads: 0,
      mp3Downloads: 0,
      totalUsers: 0,
      telegramUsers: 0,
      totalRequests: 0,
    };
  },

  /**
   * Increment metric count via /api/stats
   */
  async incrementMetric(metric: 'tiktok' | 'instagram' | 'mp3' | 'total_requests' | 'total_users' = 'tiktok'): Promise<PlatformStats | null> {
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || null;
      }
    } catch (e) {
      console.warn(`[statsService] Error incrementing ${metric}:`, e);
    }
    return null;
  }
};

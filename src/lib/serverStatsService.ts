/**
 * Server-side Firestore Statistics Service using atomic REST API
 * 100% reliable in Vercel serverless functions without hanging connections.
 */

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';

function getProjectId(): string {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'firestore-database-18d6b';
  return projectId;
}

export interface PlatformStats {
  tiktokDownloads: number;
  instagramDownloads: number;
  mp3Downloads: number;
  totalUsers: number;
  telegramUsers: number;
  totalRequests: number;
}

export const serverStatsService = {
  /**
   * Fetch live platform stats via Firestore REST API
   */
  async getStats(): Promise<PlatformStats> {
    const projectId = getProjectId();
    try {
      const docUrl = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents/statistik/platform_stats`;
      const res = await fetch(docUrl, { cache: 'no-store' });

      let tiktok = 0;
      let instagram = 0;
      let mp3 = 0;
      let totalUsers = 0;
      let telegramUsers = 0;
      let totalRequests = 0;

      if (res.ok) {
        const data = await res.json();
        const fields = data.fields || {};
        tiktok = Number(fields.tiktok?.integerValue || 0);
        instagram = Number(fields.instagram?.integerValue || 0);
        mp3 = Number(fields.mp3?.integerValue || 0);
        telegramUsers = Number(fields.telegram_users?.integerValue || 0);
        totalUsers = Number(fields.total_users?.integerValue || 0);
        totalRequests = Number(fields.total_requests?.integerValue || (tiktok + instagram + mp3));
      }

      return {
        tiktokDownloads: tiktok,
        instagramDownloads: instagram,
        mp3Downloads: mp3,
        totalUsers: Math.max(totalUsers, telegramUsers),
        telegramUsers,
        totalRequests,
      };
    } catch (e) {
      console.error('[serverStatsService] getStats error:', e);
      return {
        tiktokDownloads: 0,
        instagramDownloads: 0,
        mp3Downloads: 0,
        totalUsers: 0,
        telegramUsers: 0,
        totalRequests: 0,
      };
    }
  },

  /**
   * Atomically increment a metric using Firestore REST API commit transform
   */
  async incrementMetric(metric: 'tiktok' | 'instagram' | 'mp3' | 'total_requests' | 'total_users' = 'tiktok', amount = 1): Promise<void> {
    const projectId = getProjectId();
    try {
      const url = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents:commit`;
      const fieldTransforms = [
        {
          fieldPath: metric,
          increment: { integerValue: String(amount) }
        }
      ];

      // If downloading, also increment total_requests
      if (metric === 'tiktok' || metric === 'instagram' || metric === 'mp3') {
        fieldTransforms.push({
          fieldPath: 'total_requests',
          increment: { integerValue: String(amount) }
        });
      }

      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          writes: [
            {
              transform: {
                document: `projects/${projectId}/databases/(default)/documents/statistik/platform_stats`,
                fieldTransforms
              }
            }
          ]
        }),
        cache: 'no-store'
      });
    } catch (e) {
      console.error(`[serverStatsService] Failed to increment ${metric}:`, e);
    }
  },

  /**
   * Record Telegram User interaction atomically
   */
  async recordTelegramUser(user: { id: number | string; username?: string; first_name?: string }): Promise<void> {
    if (!user || !user.id) return;
    const projectId = getProjectId();
    try {
      const userDocUrl = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents/statistik/tg_user_${user.id}`;
      const checkRes = await fetch(userDocUrl, { cache: 'no-store' });

      if (checkRes.status === 404) {
        // Create user document & increment user count
        const commitUrl = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents:commit`;
        await fetch(commitUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            writes: [
              {
                update: {
                  name: `projects/${projectId}/databases/(default)/documents/statistik/tg_user_${user.id}`,
                  fields: {
                    userId: { stringValue: String(user.id) },
                    username: { stringValue: user.username || '' },
                    firstName: { stringValue: user.first_name || '' },
                    joinedAt: { timestampValue: new Date().toISOString() },
                    totalDownloads: { integerValue: '1' },
                  }
                }
              },
              {
                transform: {
                  document: `projects/${projectId}/databases/(default)/documents/statistik/platform_stats`,
                  fieldTransforms: [
                    {
                      fieldPath: 'telegram_users',
                      increment: { integerValue: '1' }
                    },
                    {
                      fieldPath: 'total_users',
                      increment: { integerValue: '1' }
                    }
                  ]
                }
              }
            ]
          }),
          cache: 'no-store'
        });
      }
    } catch (e) {
      console.error('[serverStatsService] Error recording telegram user:', e);
    }
  }
};

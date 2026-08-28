/**
 * Server-side Admin Service for Vidgram
 * Fetches global platform analytics, web users list, telegram bot users, and content statistics.
 */

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';

function getProjectId(): string {
  return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'firestore-database-18d6b';
}

function parseFirestoreField(field: any): any {
  if (!field) return null;
  if (field.stringValue !== undefined) return field.stringValue;
  if (field.integerValue !== undefined) return Number(field.integerValue);
  if (field.doubleValue !== undefined) return Number(field.doubleValue);
  if (field.booleanValue !== undefined) return field.booleanValue;
  if (field.timestampValue !== undefined) return field.timestampValue;
  if (field.arrayValue !== undefined) {
    return (field.arrayValue.values || []).map(parseFirestoreField);
  }
  if (field.mapValue !== undefined) {
    const obj: any = {};
    for (const [k, v] of Object.entries(field.mapValue.fields || {})) {
      obj[k] = parseFirestoreField(v);
    }
    return obj;
  }
  return null;
}

function parseDoc(doc: any): any {
  if (!doc?.fields) return null;
  const result: any = {};
  for (const [k, v] of Object.entries(doc.fields)) {
    result[k] = parseFirestoreField(v);
  }
  const nameParts = doc.name?.split('/');
  result.id = nameParts?.[nameParts.length - 1] || '';
  return result;
}

export interface AdminWebUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  subscribersCount: number;
  createdAt: string;
}

export interface AdminTelegramUser {
  userId: string;
  username: string;
  firstName: string;
  joinedAt: string;
  totalDownloads: number;
  lastActive?: string;
}

export interface AdminOverviewStats {
  totalWebUsers: number;
  totalTelegramUsers: number;
  totalTiktokDownloads: number;
  totalInstagramDownloads: number;
  totalMp3Downloads: number;
  totalHostedVideos: number;
  totalHostedImages: number;
  totalRequests: number;
}

export const serverAdminService = {
  /**
   * Fetch complete Admin Overview metrics
   */
  async getOverview(): Promise<AdminOverviewStats> {
    const projectId = getProjectId();
    try {
      // 1. Get platform stats
      const statsDocUrl = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents/statistik/platform_stats`;
      const statsRes = await fetch(statsDocUrl, { cache: 'no-store' });
      let platformStats: any = {};
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        platformStats = parseDoc(statsData) || {};
      }

      // 2. Count web users
      const usersUrl = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents/users?pageSize=300`;
      const usersRes = await fetch(usersUrl, { cache: 'no-store' });
      let webUsersCount = 0;
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        webUsersCount = (usersData.documents || []).length;
      }

      // 3. Count videos
      const videosUrl = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents/videos?pageSize=300`;
      const videosRes = await fetch(videosUrl, { cache: 'no-store' });
      let videosCount = 0;
      if (videosRes.ok) {
        const videosData = await videosRes.json();
        videosCount = (videosData.documents || []).length;
      }

      // 4. Count image posts
      const imagesUrl = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents/image_posts?pageSize=300`;
      const imagesRes = await fetch(imagesUrl, { cache: 'no-store' });
      let imagesCount = 0;
      if (imagesRes.ok) {
        const imagesData = await imagesRes.json();
        imagesCount = (imagesData.documents || []).length;
      }

      const telegramUsersCount = Number(platformStats.telegram_users || 0);
      const tiktokDownloads = Number(platformStats.tiktok || 0);
      const instagramDownloads = Number(platformStats.instagram || 0);
      const mp3Downloads = Number(platformStats.mp3 || 0);
      const totalRequests = Number(platformStats.total_requests || (tiktokDownloads + instagramDownloads + mp3Downloads));

      return {
        totalWebUsers: webUsersCount,
        totalTelegramUsers: telegramUsersCount,
        totalTiktokDownloads: tiktokDownloads,
        totalInstagramDownloads: instagramDownloads,
        totalMp3Downloads: mp3Downloads,
        totalHostedVideos: videosCount,
        totalHostedImages: imagesCount,
        totalRequests: totalRequests,
      };
    } catch (error) {
      console.error('[serverAdminService] getOverview error:', error);
      return {
        totalWebUsers: 0,
        totalTelegramUsers: 0,
        totalTiktokDownloads: 0,
        totalInstagramDownloads: 0,
        totalMp3Downloads: 0,
        totalHostedVideos: 0,
        totalHostedImages: 0,
        totalRequests: 0,
      };
    }
  },

  /**
   * Fetch registered web users
   */
  async getWebUsers(limitNum = 100): Promise<AdminWebUser[]> {
    const projectId = getProjectId();
    try {
      const url = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents/users?pageSize=${limitNum}`;
      const res = await fetch(url, { cache: 'no-store' });

      if (!res.ok) return [];

      const data = await res.json();
      const docs = data.documents || [];

      return docs.map((doc: any) => {
        const parsed = parseDoc(doc);
        return {
          uid: parsed.id || parsed.uid || '',
          displayName: parsed.displayName || 'Anonim User',
          email: parsed.email || '-',
          photoURL: parsed.photoURL || '',
          subscribersCount: Number(parsed.subscribersCount || 0),
          createdAt: parsed.createdAt || '',
        };
      });
    } catch (e) {
      console.error('[serverAdminService] getWebUsers error:', e);
      return [];
    }
  },

  /**
   * Fetch Telegram bot users
   */
  async getTelegramUsers(limitNum = 100): Promise<AdminTelegramUser[]> {
    const projectId = getProjectId();
    try {
      const url = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents/statistik?pageSize=${limitNum}`;
      const res = await fetch(url, { cache: 'no-store' });

      if (!res.ok) return [];

      const data = await res.json();
      const docs = data.documents || [];

      return docs
        .filter((doc: any) => doc.name?.includes('tg_user_'))
        .map((doc: any) => {
          const parsed = parseDoc(doc);
          return {
            userId: parsed.userId || parsed.id?.replace('tg_user_', '') || '',
            username: parsed.username ? `@${parsed.username}` : '-',
            firstName: parsed.firstName || 'Telegram User',
            joinedAt: parsed.joinedAt || '',
            totalDownloads: Number(parsed.totalDownloads || 1),
            lastActive: parsed.lastActive || parsed.joinedAt || '',
          };
        });
    } catch (e) {
      console.error('[serverAdminService] getTelegramUsers error:', e);
      return [];
    }
  }
};

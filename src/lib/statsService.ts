import { db } from './firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

const BASELINE_TIKTOK_DOWNLOADS = 168430;
const BASELINE_IG_DOWNLOADS = 112350;
const BASELINE_MP3_DOWNLOADS = 72410;
const BASELINE_TOTAL_USERS = 52380;
const BASELINE_TELEGRAM_USERS = 14620;

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
   * Get all live platform statistics from Firestore
   */
  async getDownloadStats(): Promise<PlatformStats> {
    try {
      const statsRef = doc(db, 'statistik', 'platform_stats');
      const snap = await getDoc(statsRef);

      if (snap.exists()) {
        const data = snap.data();
        return {
          tiktokDownloads: BASELINE_TIKTOK_DOWNLOADS + Number(data.tiktok || 0),
          instagramDownloads: BASELINE_IG_DOWNLOADS + Number(data.instagram || 0),
          mp3Downloads: BASELINE_MP3_DOWNLOADS + Number(data.mp3 || 0),
          totalUsers: BASELINE_TOTAL_USERS + Number(data.total_users || 0),
          telegramUsers: BASELINE_TELEGRAM_USERS + Number(data.telegram_users || 0),
          totalRequests: BASELINE_TIKTOK_DOWNLOADS + BASELINE_IG_DOWNLOADS + Number(data.total_requests || 0),
        };
      } else {
        // Initialize default stats document in Firestore
        await setDoc(statsRef, {
          tiktok: 0,
          instagram: 0,
          mp3: 0,
          total_users: 0,
          telegram_users: 0,
          total_requests: 0,
          createdAt: new Date()
        }, { merge: true });

        return {
          tiktokDownloads: BASELINE_TIKTOK_DOWNLOADS,
          instagramDownloads: BASELINE_IG_DOWNLOADS,
          mp3Downloads: BASELINE_MP3_DOWNLOADS,
          totalUsers: BASELINE_TOTAL_USERS,
          telegramUsers: BASELINE_TELEGRAM_USERS,
          totalRequests: BASELINE_TIKTOK_DOWNLOADS + BASELINE_IG_DOWNLOADS,
        };
      }
    } catch (e) {
      console.warn('[statsService] Failed to fetch stats from Firestore, fallback to baseline:', e);
      return {
        tiktokDownloads: BASELINE_TIKTOK_DOWNLOADS,
        instagramDownloads: BASELINE_IG_DOWNLOADS,
        mp3Downloads: BASELINE_MP3_DOWNLOADS,
        totalUsers: BASELINE_TOTAL_USERS,
        telegramUsers: BASELINE_TELEGRAM_USERS,
        totalRequests: BASELINE_TIKTOK_DOWNLOADS + BASELINE_IG_DOWNLOADS,
      };
    }
  },

  /**
   * Increment metric count (e.g. 'tiktok', 'instagram', 'mp3', 'total_requests')
   */
  async incrementMetric(metric: 'tiktok' | 'instagram' | 'mp3' | 'total_requests' | 'total_users' = 'tiktok') {
    try {
      const statsRef = doc(db, 'statistik', 'platform_stats');
      await setDoc(statsRef, {
        [metric]: increment(1),
        lastUpdated: new Date(),
      }, { merge: true });
    } catch (e) {
      console.warn(`[statsService] Failed to increment metric ${metric}:`, e);
    }
  },

  /**
   * Record & track unique Telegram user interaction
   */
  async recordTelegramUser(user: { id: number | string; username?: string; first_name?: string }) {
    if (!user || !user.id) return;
    try {
      const userRef = doc(db, 'statistik', `tg_user_${user.id}`);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // New unique Telegram user
        await setDoc(userRef, {
          userId: user.id,
          username: user.username || '',
          firstName: user.first_name || '',
          joinedAt: new Date(),
          totalDownloads: 1,
        });

        // Increment user counter
        const statsRef = doc(db, 'statistik', 'platform_stats');
        await setDoc(statsRef, {
          telegram_users: increment(1),
          total_users: increment(1),
          lastUpdated: new Date(),
        }, { merge: true });
      } else {
        // Existing user activity
        await setDoc(userRef, {
          totalDownloads: increment(1),
          lastActive: new Date(),
        }, { merge: true });
      }
    } catch (e) {
      console.warn('[statsService] Error recording telegram user:', e);
    }
  }
};

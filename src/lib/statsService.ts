import { db } from './firebase';
import { doc, getDoc, setDoc, increment, collection, getDocs } from 'firebase/firestore';

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
   * Get 100% Real Live Statistics directly from Firestore (No Fake/Baseline offsets)
   */
  async getDownloadStats(): Promise<PlatformStats> {
    try {
      const statsRef = doc(db, 'statistik', 'platform_stats');
      const snap = await getDoc(statsRef);

      // Also get registered web user count if available
      let registeredUsersCount = 0;
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        registeredUsersCount = usersSnap.size;
      } catch (_) {}

      if (snap.exists()) {
        const data = snap.data();
        const tiktok = Number(data.tiktok || 0);
        const instagram = Number(data.instagram || 0);
        const mp3 = Number(data.mp3 || 0);
        const telegramUsers = Number(data.telegram_users || 0);
        const totalUsers = (Number(data.total_users || 0) + registeredUsersCount);
        const totalRequests = Number(data.total_requests || (tiktok + instagram + mp3));

        return {
          tiktokDownloads: tiktok,
          instagramDownloads: instagram,
          mp3Downloads: mp3,
          totalUsers: Math.max(totalUsers, telegramUsers),
          telegramUsers: telegramUsers,
          totalRequests: totalRequests,
        };
      } else {
        // Initialize real stats document in Firestore
        await setDoc(statsRef, {
          tiktok: 0,
          instagram: 0,
          mp3: 0,
          total_users: registeredUsersCount,
          telegram_users: 0,
          total_requests: 0,
          createdAt: new Date()
        }, { merge: true });

        return {
          tiktokDownloads: 0,
          instagramDownloads: 0,
          mp3Downloads: 0,
          totalUsers: registeredUsersCount,
          telegramUsers: 0,
          totalRequests: 0,
        };
      }
    } catch (e) {
      console.warn('[statsService] Failed to fetch real stats from Firestore:', e);
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
   * Increment metric count in Firestore (e.g. 'tiktok', 'instagram', 'mp3', 'total_requests')
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
   * Record & track unique Telegram user interaction in Firestore
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

        // Increment real user counter
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
      console.warn('[statsService] Error recording telegram user in Firestore:', e);
    }
  }
};

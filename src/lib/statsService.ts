import { db } from './firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

const BASELINE_TIKTOK_DOWNLOADS = 168430;
const BASELINE_IG_DOWNLOADS = 112350;

export const statsService = {
  /**
   * Get total download counts
   */
  async getDownloadStats(): Promise<{ tiktokDownloads: number; instagramDownloads: number }> {
    try {
      const statsRef = doc(db, 'statistik', 'downloads');
      const snap = await getDoc(statsRef);

      if (snap.exists()) {
        const data = snap.data();
        return {
          tiktokDownloads: BASELINE_TIKTOK_DOWNLOADS + Number(data.tiktok || 0),
          instagramDownloads: BASELINE_IG_DOWNLOADS + Number(data.instagram || 0),
        };
      } else {
        // Initialize if not exists
        await setDoc(statsRef, { tiktok: 0, instagram: 0, createdAt: new Date() }, { merge: true });
        return {
          tiktokDownloads: BASELINE_TIKTOK_DOWNLOADS,
          instagramDownloads: BASELINE_IG_DOWNLOADS,
        };
      }
    } catch (e) {
      console.warn('[statsService] Failed to fetch stats from Firestore, using baseline:', e);
      return {
        tiktokDownloads: BASELINE_TIKTOK_DOWNLOADS,
        instagramDownloads: BASELINE_IG_DOWNLOADS,
      };
    }
  },

  /**
   * Increment download count for a given platform
   */
  async incrementDownload(platform: 'tiktok' | 'instagram' = 'tiktok') {
    try {
      const statsRef = doc(db, 'statistik', 'downloads');
      await setDoc(statsRef, {
        [platform]: increment(1),
        lastUpdated: new Date(),
      }, { merge: true });
    } catch (e) {
      console.warn('[statsService] Failed to increment download stats:', e);
    }
  }
};

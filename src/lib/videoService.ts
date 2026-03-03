import { db } from "./firebase";
import { collection, addDoc, getDocs, query, orderBy, limit, increment, doc, updateDoc, where, getDoc, startAfter } from "firebase/firestore";

export interface VideoMetadata {
    id?: string;
    title: string;
    description: string;
    cloudinaryId: string;
    thumbnailUrl: string;
    videoUrl: string;
    views: number;
    likes: number;
    shares: number;
    createdAt: any;
    slug: string;
    keywords: string[];
    uploaderId: string; // Link video to user
}

// Helper to generate search keywords
const generateKeywords = (title: string, description: string) => {
    const text = `${title} ${description}`.toLowerCase();
    // Remove punctuation and split by spaces
    const words = text.replace(/[^\w\s]/g, '').split(/\s+/).filter(word => word.length > 2);
    // Deduplicate and return
    return Array.from(new Set(words));
};

export interface VideoComment {
    id?: string;
    videoId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    parentId: string | null; // For threading
    createdAt: any;
}

export const videoService = {
    async addVideo(video: Omit<VideoMetadata, "views" | "likes" | "shares" | "createdAt" | "id" | "keywords">) {
        const videoRef = collection(db, "videos");
        const keywords = generateKeywords(video.title, video.description);

        return await addDoc(videoRef, {
            ...video,
            views: 0,
            likes: 0,
            shares: 0,
            createdAt: new Date(),
            keywords
        });
    },

    async getVideosByUser(userId: string, limitNum = 20, lastCreatedAt?: any) {
        const videoRef = collection(db, "videos");
        let q = query(videoRef, where("uploaderId", "==", userId), orderBy("createdAt", "desc"), limit(limitNum));

        if (lastCreatedAt) {
            q = query(videoRef, where("uploaderId", "==", userId), orderBy("createdAt", "desc"), startAfter(lastCreatedAt), limit(limitNum));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoMetadata));
    },

    async getVideos(limitNum = 10, lastCreatedAt?: any) {
        const videoRef = collection(db, "videos");
        let q = query(videoRef, orderBy("createdAt", "desc"), limit(limitNum));

        if (lastCreatedAt) {
            q = query(videoRef, orderBy("createdAt", "desc"), startAfter(lastCreatedAt), limit(limitNum));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoMetadata));
    },

    async getVideoBySlug(slug: string) {
        const videoRef = collection(db, "videos");
        const q = query(videoRef, where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const videoDoc = querySnapshot.docs[0];
        return { id: videoDoc.id, ...videoDoc.data() } as VideoMetadata;
    },

    async searchVideos(searchQuery: string, limitNum = 20, lastCreatedAt?: any) {
        if (!searchQuery.trim()) {
            return this.getVideos(limitNum, lastCreatedAt);
        }

        const videoRef = collection(db, "videos");
        const words = searchQuery.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);

        // Firestore 'array-contains-any' is limited to 10 elements
        const searchWords = words.slice(0, 10);

        if (searchWords.length === 0) return this.getVideos(limitNum, lastCreatedAt);

        let q = query(
            videoRef,
            where("keywords", "array-contains-any", searchWords),
            orderBy("createdAt", "desc"),
            limit(limitNum)
        );

        if (lastCreatedAt) {
            q = query(
                videoRef,
                where("keywords", "array-contains-any", searchWords),
                orderBy("createdAt", "desc"),
                startAfter(lastCreatedAt),
                limit(limitNum)
            );
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoMetadata));
    },

    async incrementViews(id: string) {
        const videoDoc = doc(db, "videos", id);
        return await updateDoc(videoDoc, {
            views: increment(1)
        });
    },

    async incrementLikes(id: string) {
        const videoDoc = doc(db, "videos", id);
        return await updateDoc(videoDoc, {
            likes: increment(1)
        });
    },

    async incrementShares(id: string) {
        const videoDoc = doc(db, "videos", id);
        return await updateDoc(videoDoc, {
            shares: increment(1)
        });
    },

    // --- User related functions ---
    async getUserProfile(userId: string) {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? { uid: userSnap.id, ...userSnap.data() } : null;
    },

    async toggleSubscribe(currentUserId: string, targetUserId: string) {
        if (!currentUserId || !targetUserId || currentUserId === targetUserId) return;

        const subRef = doc(db, `users/${currentUserId}/subscriptions`, targetUserId);
        const subSnap = await getDoc(subRef);

        const targetUserRef = doc(db, "users", targetUserId);

        if (subSnap.exists()) {
            // Unsubscribe
            await import("firebase/firestore").then(m => m.deleteDoc(subRef));
            await updateDoc(targetUserRef, {
                subscribersCount: increment(-1)
            });
            return false;
        } else {
            // Subscribe
            await import("firebase/firestore").then(m => m.setDoc(subRef, { subscribedAt: new Date() }));
            await updateDoc(targetUserRef, {
                subscribersCount: increment(1)
            });
            return true;
        }
    },

    async checkSubscription(currentUserId: string, targetUserId: string) {
        if (!currentUserId || !targetUserId) return false;
        const subRef = doc(db, `users/${currentUserId}/subscriptions`, targetUserId);
        const subSnap = await getDoc(subRef);
        return subSnap.exists();
    },

    // --- Comment related functions ---
    async addComment(comment: Omit<VideoComment, "id" | "createdAt">) {
        const commentsRef = collection(db, "comments");
        return await addDoc(commentsRef, {
            ...comment,
            createdAt: new Date()
        });
    },

    async getComments(videoId: string) {
        const commentsRef = collection(db, "comments");
        const q = query(
            commentsRef,
            where("videoId", "==", videoId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoComment));
    }
};

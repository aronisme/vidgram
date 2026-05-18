import { db } from "./firebase";
import { collection, addDoc, getDocs, query, orderBy, limit, increment, doc, updateDoc, where, getDoc, startAfter } from "firebase/firestore";

export interface ImagePostMetadata {
    id?: string;
    title: string;
    description: string;
    images: {
        url: string;
        cloudinaryId: string;
    }[];
    isPrivate: boolean;
    views: number;
    likes: number;
    shares: number;
    createdAt: any;
    slug: string;
    keywords: string[];
    uploaderId: string;
}

const generateKeywords = (title: string, description: string) => {
    const text = `${title} ${description}`.toLowerCase();
    const words = text.replace(/[^\w\s]/g, '').split(/\s+/).filter(word => word.length > 2);
    return Array.from(new Set(words));
};

export const imageService = {
    async addImagePost(post: Omit<ImagePostMetadata, "views" | "likes" | "shares" | "createdAt" | "id" | "keywords">) {
        const imageRef = collection(db, "image_posts");
        const keywords = generateKeywords(post.title, post.description);

        return await addDoc(imageRef, {
            ...post,
            views: 0,
            likes: 0,
            shares: 0,
            createdAt: new Date(),
            keywords
        });
    },

    async getImagePostsByUser(userId: string, limitNum = 20, lastCreatedAt?: any, includePrivate = true) {
        const imageRef = collection(db, "image_posts");
        let conditions = [where("uploaderId", "==", userId)];
        
        if (!includePrivate) {
            conditions.push(where("isPrivate", "==", false));
        }

        let q = query(imageRef, ...conditions, orderBy("createdAt", "desc"), limit(limitNum));

        if (lastCreatedAt) {
            q = query(imageRef, ...conditions, orderBy("createdAt", "desc"), startAfter(lastCreatedAt), limit(limitNum));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ImagePostMetadata));
    },

    async getPublicImagePosts(limitNum = 10, lastCreatedAt?: any) {
        const imageRef = collection(db, "image_posts");
        let q = query(imageRef, where("isPrivate", "==", false), orderBy("createdAt", "desc"), limit(limitNum));

        if (lastCreatedAt) {
            q = query(imageRef, where("isPrivate", "==", false), orderBy("createdAt", "desc"), startAfter(lastCreatedAt), limit(limitNum));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ImagePostMetadata));
    },

    async getImagePostBySlug(slug: string) {
        const imageRef = collection(db, "image_posts");
        const q = query(imageRef, where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const imageDoc = querySnapshot.docs[0];
        return { id: imageDoc.id, ...imageDoc.data() } as ImagePostMetadata;
    },

    async incrementViews(id: string) {
        const imageDoc = doc(db, "image_posts", id);
        return await updateDoc(imageDoc, { views: increment(1) });
    },
    async incrementLikes(id: string) {
        const imageDoc = doc(db, "image_posts", id);
        return await updateDoc(imageDoc, { likes: increment(1) });
    },
    async incrementShares(id: string) {
        const imageDoc = doc(db, "image_posts", id);
        return await updateDoc(imageDoc, { shares: increment(1) });
    },

    async updateImagePost(id: string, data: Partial<Omit<ImagePostMetadata, "id" | "uploaderId" | "createdAt">>) {
        const imageRef = doc(db, "image_posts", id);
        return await updateDoc(imageRef, data);
    },

    async deleteImagePost(id: string) {
        const imageRef = doc(db, "image_posts", id);
        return await import("firebase/firestore").then(m => m.deleteDoc(imageRef));
    }
};

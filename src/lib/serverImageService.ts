/**
 * Server-side Firestore service for Image Posts using REST API.
 * Used by Server Components and server-side rendering (SSR).
 */

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';

function getProjectUrl() {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set');
    return `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents`;
}

// Helper to extract value from Firestore REST field
function extractValue(field: any): any {
    if (!field) return null;
    if (field.stringValue !== undefined) return field.stringValue;
    if (field.integerValue !== undefined) return Number(field.integerValue);
    if (field.doubleValue !== undefined) Number(field.doubleValue);
    if (field.booleanValue !== undefined) return field.booleanValue;
    if (field.timestampValue !== undefined) return field.timestampValue;
    if (field.arrayValue !== undefined) {
        return (field.arrayValue.values || []).map(extractValue);
    }
    if (field.mapValue !== undefined) {
        const obj: any = {};
        for (const [k, v] of Object.entries(field.mapValue.fields || {})) {
            obj[k] = extractValue(v);
        }
        return obj;
    }
    return null;
}

// Convert a Firestore REST document into a flat object
function parseDocument(doc: any): any {
    if (!doc?.fields) return null;
    const result: any = {};
    for (const [key, value] of Object.entries(doc.fields)) {
        result[key] = extractValue(value);
    }
    // Extract document ID from the name field
    const nameParts = doc.name?.split('/');
    result.id = nameParts?.[nameParts.length - 1] || '';
    return result;
}

export interface ServerImagePostMetadata {
    id: string;
    title: string;
    description: string;
    images: { url: string; cloudinaryId: string }[];
    isPrivate: boolean;
    views: number;
    likes: number;
    shares: number;
    createdAt: string;
    slug: string;
    keywords: string[];
    uploaderId: string;
}

export const serverImageService = {
    async getPublicImagePosts(limitNum = 10): Promise<ServerImagePostMetadata[]> {
        try {
            const url = `${getProjectUrl()}:runQuery`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    structuredQuery: {
                        from: [{ collectionId: 'image_posts' }],
                        where: {
                            fieldFilter: {
                                field: { fieldPath: 'isPrivate' },
                                op: 'EQUAL',
                                value: { booleanValue: false },
                            },
                        },
                        orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }],
                        limit: limitNum,
                    },
                }),
                cache: 'no-store',
            });

            if (!response.ok) {
                console.error('[serverImageService] getPublicImagePosts error:', response.status);
                return [];
            }

            const data = await response.json();
            return data
                .filter((item: any) => item.document)
                .map((item: any) => parseDocument(item.document))
                .filter(Boolean) as ServerImagePostMetadata[];
        } catch (e) {
            console.error('[serverImageService] getPublicImagePosts failed:', e);
            return [];
        }
    },

    async getImagePostBySlug(slug: string): Promise<ServerImagePostMetadata | null> {
        try {
            const url = `${getProjectUrl()}:runQuery`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    structuredQuery: {
                        from: [{ collectionId: 'image_posts' }],
                        where: {
                            fieldFilter: {
                                field: { fieldPath: 'slug' },
                                op: 'EQUAL',
                                value: { stringValue: slug },
                            },
                        },
                        limit: 1,
                    },
                }),
                cache: 'no-store',
            });

            if (!response.ok) {
                console.error('[serverImageService] getImagePostBySlug error:', response.status);
                return null;
            }

            const data = await response.json();
            const docs = data.filter((item: any) => item.document);
            if (docs.length === 0) return null;
            return parseDocument(docs[0].document) as ServerImagePostMetadata;
        } catch (e) {
            console.error('[serverImageService] getImagePostBySlug failed:', e);
            return null;
        }
    },

    async incrementViews(postId: string): Promise<void> {
        try {
            const docUrl = `${getProjectUrl()}/image_posts/${postId}`;
            const response = await fetch(docUrl, {
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
            });

            if (!response.ok) return;

            const doc = await response.json();
            const currentViews = Number(doc.fields?.views?.integerValue || 0);

            await fetch(`${docUrl}?updateMask.fieldPaths=views`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fields: {
                        views: { integerValue: String(currentViews + 1) },
                    },
                }),
            });
        } catch (e) {
            console.error('[serverImageService] incrementViews failed:', e);
        }
    },
};

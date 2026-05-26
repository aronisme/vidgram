/**
 * Server-side Firestore service using REST API.
 * Used by Server Components and server-side rendering (SSR) in Vercel's
 * serverless functions where the Firebase client SDK is unreliable.
 */

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';

function getProjectUrl() {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set');
    return `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents`;
}

// Resilient fetch with automatic retries for network robustness
async function resilientFetch(url: string, options?: RequestInit, retries = 2, delay = 500): Promise<Response> {
    try {
        return await fetch(url, options);
    } catch (e) {
        if (retries > 0) {
            console.warn(`[serverVideoService] Fetch failed, retrying in ${delay}ms... (Retries left: ${retries})`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return resilientFetch(url, options, retries - 1, delay * 2);
        }
        throw e;
    }
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

export interface ServerVideoMetadata {
    id: string;
    title: string;
    description: string;
    cloudinaryId: string;
    thumbnailUrl: string;
    videoUrl: string;
    views: number;
    likes: number;
    shares: number;
    createdAt: string;
    slug: string;
    keywords: string[];
    uploaderId: string;
}

export const serverVideoService = {
    async getVideos(limitNum = 10): Promise<ServerVideoMetadata[]> {
        try {
            const url = `${getProjectUrl()}:runQuery`;
            const response = await resilientFetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    structuredQuery: {
                        from: [{ collectionId: 'videos' }],
                        orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }],
                        limit: limitNum,
                    },
                }),
                cache: 'no-store',
            });

            if (!response.ok) {
                console.error('[serverVideoService] getVideos error:', response.status);
                return [];
            }

            const data = await response.json();
            return data
                .filter((item: any) => item.document)
                .map((item: any) => parseDocument(item.document))
                .filter(Boolean) as ServerVideoMetadata[];
        } catch (e) {
            console.error('[serverVideoService] getVideos failed:', e);
            return [];
        }
    },

    async getVideoBySlug(slug: string): Promise<ServerVideoMetadata | null> {
        try {
            const url = `${getProjectUrl()}:runQuery`;
            const response = await resilientFetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    structuredQuery: {
                        from: [{ collectionId: 'videos' }],
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
                console.error('[serverVideoService] getVideoBySlug error:', response.status);
                return null;
            }

            const data = await response.json();
            const docs = data.filter((item: any) => item.document);
            if (docs.length === 0) return null;
            return parseDocument(docs[0].document) as ServerVideoMetadata;
        } catch (e) {
            console.error('[serverVideoService] getVideoBySlug failed:', e);
            return null;
        }
    },

    async getUserProfile(userId: string): Promise<any> {
        try {
            const url = `${getProjectUrl()}/users/${userId}`;
            const response = await resilientFetch(url, {
                cache: 'no-store',
            });

            if (!response.ok) {
                // User document may not exist
                if (response.status === 404) return null;
                console.error('[serverVideoService] getUserProfile error:', response.status);
                return null;
            }

            const doc = await response.json();
            const parsed = parseDocument(doc);
            if (parsed) parsed.uid = userId;
            return parsed;
        } catch (e) {
            console.error('[serverVideoService] getUserProfile failed:', e);
            return null;
        }
    },

    async incrementViews(videoId: string): Promise<void> {
        // Fire-and-forget: use Firestore REST API to increment views
        // Note: REST API doesn't support FieldValue.increment() directly,
        // so we read-then-write. For high traffic, consider Cloud Functions instead.
        try {
            const docUrl = `${getProjectUrl()}/videos/${videoId}`;
            const response = await resilientFetch(docUrl, {
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
            });

            if (!response.ok) return;

            const doc = await response.json();
            const currentViews = Number(doc.fields?.views?.integerValue || 0);

            // PATCH to update only the views field
            await resilientFetch(`${docUrl}?updateMask.fieldPaths=views`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fields: {
                        views: { integerValue: String(currentViews + 1) },
                    },
                }),
            });
        } catch (e) {
            // Silent fail — view count is non-critical
            console.error('[serverVideoService] incrementViews failed:', e);
        }
    },
};

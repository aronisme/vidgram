import { MetadataRoute } from 'next';

// Force this route to be dynamic (never statically cached at build)
export const dynamic = 'force-dynamic';

// Re-generate the sitemap every 1 hour (3600 seconds)
export const revalidate = 3600;

/**
 * Fetch videos directly from Firestore REST API.
 * This avoids depending on the client-side Firebase SDK which can fail
 * in serverless/edge environments (Netlify, Vercel Functions, etc.).
 */
async function fetchVideosFromFirestore(): Promise<{ slug: string; createdAt: string }[]> {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!projectId) {
        console.error('[Sitemap] NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set');
        return [];
    }

    try {
        // Firestore REST API — query the "videos" collection, ordered by createdAt desc, limit 1000
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                structuredQuery: {
                    from: [{ collectionId: 'videos' }],
                    orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }],
                    limit: 1000,
                    select: {
                        fields: [
                            { fieldPath: 'slug' },
                            { fieldPath: 'createdAt' },
                        ],
                    },
                },
            }),
            // Don't cache this fetch — we want fresh data each time the sitemap revalidates
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('[Sitemap] Firestore REST API error:', response.status, await response.text());
            return [];
        }

        const data = await response.json();

        // Parse Firestore REST response format
        return data
            .filter((item: any) => item.document) // skip empty results
            .map((item: any) => {
                const fields = item.document.fields;
                const slug = fields?.slug?.stringValue || '';
                const createdAt = fields?.createdAt?.timestampValue || new Date().toISOString();
                return { slug, createdAt };
            })
            .filter((v: any) => v.slug); // skip entries without a slug
    } catch (e) {
        console.error('[Sitemap] Failed to fetch videos from Firestore REST API:', e);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vidgram.web.id';

    // 1. Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
        },
        {
            url: `${baseUrl}/discovery`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.9,
        },
    ];

    // 2. Dynamic Video Routes (via Firestore REST API)
    const videos = await fetchVideosFromFirestore();

    const dynamicRoutes: MetadataRoute.Sitemap = videos.map((video) => ({
        url: `${baseUrl}/video/${video.slug}`,
        lastModified: new Date(video.createdAt),
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    return [...staticRoutes, ...dynamicRoutes];
}

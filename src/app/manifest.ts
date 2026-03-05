import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Vidgram',
        short_name: 'Vidgram',
        description: 'The minimalist video sharing platform. Fast, secure, and SEO-friendly.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/favicon.ico?v=2',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/android-chrome-192x192.png?v=2',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/android-chrome-512x512.png?v=2',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}

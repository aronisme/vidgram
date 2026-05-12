"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UpscalerPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="animate-fade-in" style={{ width: '100%', height: 'calc(100vh - var(--navbar-height))', display: 'flex', flexDirection: 'column' }}>
            <iframe 
                src="/upscaler/index.html" 
                style={{ width: '100%', flex: 1, border: 'none' }}
                title="AI Video Upscaler"
                allow="fullscreen"
            />
        </div>
    );
}

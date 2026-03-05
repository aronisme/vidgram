"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div className="spinner"></div>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Authenticating...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {children}
        </div>
    );
}

"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export default function PrivateGuard({ uploaderId, children }: { uploaderId: string, children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (user && user.uid === uploaderId) {
                setIsAllowed(true);
            } else {
                // Tendang kembali ke home jika bukan pemilik
                router.push("/");
            }
        }
    }, [user, loading, uploaderId, router]);

    if (loading || !isAllowed) {
        return (
            <div style={{ paddingTop: '10rem', paddingBottom: '10rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                <ShieldAlert size={48} color="#ef4444" style={{ opacity: 0.8 }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Konten Privat</h2>
                <p>Memeriksa otorisasi keamanan...</p>
            </div>
        );
    }

    return <>{children}</>;
}

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

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
            <div className="flex justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
                    <p className="text-[var(--text-secondary)]">Memeriksa autentikasi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            {children}
        </div>
    );
}

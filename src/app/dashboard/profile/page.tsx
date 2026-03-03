"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { User as UserIcon, LogOut, CheckCircle, AlertCircle, Loader2, Save } from "lucide-react";

export default function ProfilePage() {
    const { user, dbUser, signOut } = useAuth();
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    // Local state for form
    const [formData, setFormData] = useState({
        displayName: "",
        bio: "",
    });

    useEffect(() => {
        if (dbUser) {
            setFormData({
                displayName: dbUser.displayName || "",
                bio: dbUser.bio || "",
            });
        }
    }, [dbUser]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                displayName: formData.displayName,
                bio: formData.bio,
            });
            addToast("Profil berhasil diperbarui!", "success");
        } catch (error: any) {
            addToast(error.message || "Gagal memperbarui profil.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (!user || !dbUser) return null;

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold">Profile Settings</h1>
                <p className="text-[var(--text-secondary)]">Kelola informasi publik dan akun kamu.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 glass p-8 rounded-[var(--radius-lg)] w-full md:w-64">
                    <img
                        src={dbUser.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                        alt={dbUser.displayName}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-xl"
                    />
                    <div className="text-center">
                        <h3 className="font-bold text-lg">{dbUser.displayName}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{dbUser.subscribersCount} Subscribers</p>
                    </div>

                    <button
                        onClick={signOut}
                        className="mt-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 w-full py-2 rounded-lg transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>

                {/* Form Section */}
                <div className="flex-1 glass p-8 rounded-[var(--radius-lg)] flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">Nama Lengkap (Display Name)</label>
                        <input
                            type="text"
                            className="glass bg-transparent p-3 rounded-[var(--radius-md)] outline-none focus:border-[var(--accent)] transition-colors"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">Bio / Deskripsi Kreator</label>
                        <textarea
                            rows={4}
                            placeholder="Ceritakan sedikit tentang dirimu atau konten yang kamu buat..."
                            className="glass bg-transparent p-3 rounded-[var(--radius-md)] outline-none focus:border-[var(--accent)] transition-colors resize-none"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm text-[var(--text-secondary)]">Email Address (Read-Only)</label>
                        <input
                            type="email"
                            disabled
                            className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] p-3 rounded-[var(--radius-md)] outline-none cursor-not-allowed"
                            value={dbUser.email}
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-primary flex items-center gap-2 px-6 py-2"
                        >
                            {isSaving ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { LogOut, Loader2, Save } from "lucide-react";

export default function ProfilePage() {
    const { user, dbUser, signOut } = useAuth();
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

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
            addToast("Profile updated successfully!", "success");
        } catch (error: any) {
            addToast(error.message || "Failed to update profile.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (!user || !dbUser) return null;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Profile Settings</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9375rem' }}>
                    Kelola informasi publik dan akun kamu.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Avatar Card */}
                <div className="card" style={{
                    padding: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                }}>
                    <div style={{
                        position: 'relative',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        padding: '3px',
                        background: 'var(--gradient-primary)',
                        flexShrink: 0,
                    }}>
                        <img
                            src={dbUser.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                            alt={dbUser.displayName}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '3px solid var(--bg-secondary)',
                            }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: 700, fontSize: '1.125rem' }}>{dbUser.displayName}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                            {dbUser.subscribersCount || 0} Subscribers
                        </p>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem', marginTop: '0.125rem' }}>
                            {dbUser.email}
                        </p>
                    </div>
                    <button
                        onClick={signOut}
                        className="btn-ghost"
                        style={{ color: 'var(--error)', fontSize: '0.8125rem' }}
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>

                {/* Form Card */}
                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Nama Lengkap (Display Name)</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Bio / Deskripsi Kreator</label>
                        <textarea
                            rows={4}
                            placeholder="Ceritakan sedikit tentang dirimu atau konten yang kamu buat..."
                            className="input-field"
                            style={{ resize: 'none' }}
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Email Address (Read-Only)</label>
                        <input
                            type="email"
                            disabled
                            className="input-field"
                            value={dbUser.email}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-primary"
                            style={{ padding: '0.625rem 1.5rem' }}
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

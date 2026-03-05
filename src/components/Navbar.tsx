"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Video, BarChart3, Upload, Search, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, dbUser, signInWithGoogle, signOut } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            width: '100%',
            borderBottom: '1px solid var(--border)',
            background: 'var(--glass-strong)',
            backdropFilter: 'blur(20px) saturate(200%)',
            WebkitBackdropFilter: 'blur(20px) saturate(200%)',
        }}>
            <div className="container" style={{
                height: 'var(--navbar-height)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                    }}>
                        <Video size={18} color="white" />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Vidgram</span>
                </Link>

                {/* Nav Items */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Link href="/discovery" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        transition: 'all 0.2s ease',
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.color = 'var(--accent)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                        <Search size={16} />
                        Discovery
                    </Link>

                    {user ? (
                        <>
                            <Link href="/dashboard" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '9999px',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                transition: 'all 0.2s ease',
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.color = 'var(--accent)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                            >
                                <BarChart3 size={16} />
                                Dashboard
                            </Link>

                            <Link href="/dashboard/upload" style={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '9999px',
                                fontWeight: 600,
                                fontSize: '0.8125rem',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                                transition: 'all 0.25s ease',
                            }}>
                                <Upload size={14} />
                                Upload
                            </Link>

                            {/* User Menu */}
                            <div ref={dropdownRef} style={{ position: 'relative', marginLeft: '0.25rem' }}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        border: '1.5px solid var(--border)',
                                        borderRadius: '9999px',
                                        padding: '0.25rem',
                                        paddingLeft: '0.75rem',
                                        background: 'var(--bg-secondary)',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.2s ease',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    <span style={{
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        maxWidth: '100px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>{dbUser?.displayName || "User"}</span>
                                    <img
                                        src={dbUser?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                                        alt="Avatar"
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            background: 'var(--bg-tertiary)',
                                        }}
                                    />
                                </button>

                                {/* Dropdown */}
                                {showDropdown && (
                                    <div style={{
                                        position: 'absolute',
                                        right: 0,
                                        marginTop: '0.5rem',
                                        width: '200px',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '16px',
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                        zIndex: 60,
                                        animation: 'slideDown 0.2s ease-out',
                                    }}>
                                        <Link href="/dashboard/profile" onClick={() => setShowDropdown(false)} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem 1rem',
                                            color: 'var(--text-primary)',
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            transition: 'background 0.15s ease',
                                        }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-light)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <UserIcon size={16} />
                                            My Profile
                                        </Link>
                                        <button onClick={() => { signOut(); setShowDropdown(false); }} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem 1rem',
                                            color: '#ef4444',
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            width: '100%',
                                            textAlign: 'left',
                                            transition: 'background 0.15s ease',
                                        }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <button onClick={signInWithGoogle} style={{
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            border: '1.5px solid var(--border)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            transition: 'all 0.2s ease',
                        }}>
                            <LogIn size={16} />
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

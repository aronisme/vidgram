"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BarChart3, Upload, Search, LogIn, LogOut, User as UserIcon, Menu, X, Sparkles, Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, dbUser, signInWithGoogle, signOut } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

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

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setShowMobileMenu(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (showMobileMenu) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [showMobileMenu]);

    const closeMobileMenu = () => setShowMobileMenu(false);

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
                position: 'relative',
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                }}>
                    <Image
                        src="/logo.png"
                        alt="Vidgram Logo"
                        width={36}
                        height={36}
                        style={{ borderRadius: '8px' }}
                        priority
                    />
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Vidgram</span>
                </Link>

                {/* Desktop Nav Items */}
                <div className="desktop-only" style={{ alignItems: 'center', gap: '0.375rem' }}>
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

                    <Link href="/tiktok" style={{
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
                        <Download size={16} />
                        TikTok Pro
                    </Link>

                    <Link href="/upscaler" style={{
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
                        <Sparkles size={16} />
                        Upscaler
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

                {/* Mobile Hamburger Button */}
                <button
                    className="mobile-only hamburger-btn"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    aria-label="Toggle menu"
                >
                    {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Mobile Menu Drawer */}
                {showMobileMenu && (
                    <div className="mobile-nav-drawer">
                        <Link href="/discovery" className="mobile-nav-link" onClick={closeMobileMenu}>
                            <Search size={18} />
                            Discovery
                        </Link>
                        <Link href="/tiktok" className="mobile-nav-link" onClick={closeMobileMenu}>
                            <Download size={18} />
                            TikTok Downloader
                        </Link>
                        <Link href="/upscaler" className="mobile-nav-link" onClick={closeMobileMenu}>
                            <Sparkles size={18} />
                            Upscaler
                        </Link>

                        {user ? (
                            <>
                                <Link href="/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>
                                    <BarChart3 size={18} />
                                    Dashboard
                                </Link>
                                <Link href="/dashboard/upload" className="mobile-nav-link" onClick={closeMobileMenu}>
                                    <Upload size={18} />
                                    Upload Video
                                </Link>

                                <div className="mobile-nav-divider" />

                                {/* User Info */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                }}>
                                    <img
                                        src={dbUser?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                                        alt="Avatar"
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            background: 'var(--bg-tertiary)',
                                        }}
                                    />
                                    <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{dbUser?.displayName || "User"}</span>
                                </div>

                                <Link href="/dashboard/profile" className="mobile-nav-link" onClick={closeMobileMenu}>
                                    <UserIcon size={18} />
                                    My Profile
                                </Link>
                                <button
                                    onClick={() => { signOut(); closeMobileMenu(); }}
                                    className="mobile-nav-link mobile-nav-link-danger"
                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => { signInWithGoogle(); closeMobileMenu(); }}
                                className="mobile-nav-link"
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                            >
                                <LogIn size={18} />
                                Sign In with Google
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile backdrop overlay */}
            {showMobileMenu && (
                <div className="mobile-nav-backdrop" onClick={closeMobileMenu} />
            )}
        </nav>
    );
}

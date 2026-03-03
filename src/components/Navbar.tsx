"use client";

import Link from "next/link";
import { Video, BarChart3, Upload, Search, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, dbUser, signInWithGoogle, signOut } = useAuth();

    return (
        <nav className="glass sticky top-0 z-50 w-full mb-8">
            <div className="container h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
                    <div className="bg-[var(--accent)] p-1.5 rounded-lg">
                        <Video size={20} className="text-white" />
                    </div>
                    <span>Vidgram</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/discovery" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 font-medium">
                        <Search size={18} />
                        <span className="hidden sm:inline">Discovery</span>
                    </Link>

                    {user ? (
                        <>
                            <Link href="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 font-medium">
                                <BarChart3 size={18} />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                            <Link href="/dashboard/upload" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
                                <Upload size={16} />
                                <span className="hidden sm:inline">Upload</span>
                            </Link>
                            <div className="group relative">
                                <button className="flex items-center gap-2 border border-[var(--border)] rounded-full p-1 pl-3 bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors">
                                    <span className="text-sm font-medium hidden sm:inline max-w-[100px] truncate">{dbUser?.displayName || "User"}</span>
                                    <img src={dbUser?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} alt="Avatar" className="w-8 h-8 rounded-full bg-white object-cover" />
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden text-sm">
                                    <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer">
                                        <UserIcon size={16} />
                                        <span>My Profile</span>
                                    </Link>
                                    <button onClick={signOut} className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer w-full text-left">
                                        <LogOut size={16} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <button onClick={signInWithGoogle} className="glass border border-[var(--border)] px-4 py-2 rounded-lg flex items-center gap-2 hover:border-[var(--accent)] transition-colors font-medium">
                            <LogIn size={18} />
                            <span>Sign In</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

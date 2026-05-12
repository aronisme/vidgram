"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut,
    User
} from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "./ToastContext";

interface AuthContextType {
    user: User | null;
    dbUser: any | null; // Profile from Firestore
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    dbUser: null,
    loading: true,
    signInWithGoogle: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [dbUser, setDbUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                setUser(currentUser);

                if (currentUser) {
                    // Fetch or create user profile in Firestore
                    const userRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        setDbUser(userSnap.data());
                    } else {
                        // Create basic profile for new user
                        const newProfile = {
                            uid: currentUser.uid,
                            displayName: currentUser.displayName,
                            email: currentUser.email,
                            photoURL: currentUser.photoURL,
                            subscribersCount: 0,
                            createdAt: new Date(),
                        };
                        await setDoc(userRef, newProfile);
                        setDbUser(newProfile);
                    }
                } else {
                    setDbUser(null);
                }
            } catch (error) {
                console.error("Error in AuthContext listener:", error);
                addToast("Error loading user profile. Check your connection.", "error");
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [addToast]);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            addToast("Successfully signed in!", "success");
        } catch (error: any) {
            console.error("Error signing in with Google", error);
            addToast(error.message || "Failed to sign in. Please try again.", "error");
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            addToast("Signed out successfully", "info");
        } catch (error) {
            console.error("Error signing out", error);
            addToast("Error signing out", "error");
        }
    };

    return (
        <AuthContext.Provider value={{ user, dbUser, loading, signInWithGoogle, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

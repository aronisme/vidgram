import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Lazy initialization — only runs when actually called in the browser,
// preventing crashes during Vercel's static prerendering phase.
let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

function getApp(): FirebaseApp {
    if (!_app) {
        if (!firebaseConfig.apiKey) {
            throw new Error("Firebase API key is not configured. Set NEXT_PUBLIC_FIREBASE_API_KEY.");
        }
        _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    }
    return _app;
}

// Use getters so Firebase is only initialized when accessed at runtime (client-side)
const app = new Proxy({} as FirebaseApp, {
    get(_, prop) {
        return (getApp() as any)[prop];
    }
});

const db = new Proxy({} as Firestore, {
    get(_, prop) {
        if (!_db) _db = getFirestore(getApp());
        return (_db as any)[prop];
    }
});

const auth = new Proxy({} as Auth, {
    get(_, prop) {
        if (!_auth) _auth = getAuth(getApp());
        return (_auth as any)[prop];
    }
});

const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };

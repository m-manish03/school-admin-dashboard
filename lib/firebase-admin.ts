import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
// This is used in API routes (Server-side only)
function getFirebaseAdminApp() {
    if (getApps().length) {
        return getApp();
    }

    const {
        FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY,
    } = process.env;

    // Check if we have the necessary environment variables
    if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
        // In development or build time, we might not have these. 
        // Return null or throw error depending on usage.
        // For now, we'll return undefined and let the caller handle it.
        const missing = [];
        if (!FIREBASE_PROJECT_ID) missing.push("FIREBASE_PROJECT_ID");
        if (!FIREBASE_CLIENT_EMAIL) missing.push("FIREBASE_CLIENT_EMAIL");
        if (!FIREBASE_PRIVATE_KEY) missing.push("FIREBASE_PRIVATE_KEY");

        console.warn(`Firebase Admin environment variables missing: ${missing.join(", ")}`);
        return undefined;
    }

    const adminConfig = {
        credential: cert({
            projectId: FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            // Replace literal string '\n' with actual newlines if stored in .env as single line
            privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
    };

    return initializeApp(adminConfig);
}

const app = getFirebaseAdminApp();
const adminAuth = app ? getAuth(app) : null;
const adminDb = app ? getFirestore(app) : null;

export { adminAuth, adminDb };

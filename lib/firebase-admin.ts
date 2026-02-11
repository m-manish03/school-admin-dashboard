import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
// This is used in API routes (Server-side only)
// Initialize Firebase Admin SDK
// This is used in API routes (Server-side only)
function getFirebaseAdminApp(name?: string) {
    // If specific app requested, try to retrieve it
    if (name && getApps().find(app => app.name === name)) {
        return getApp(name);
    }
    // If default app requested
    if (!name && getApps().length) {
        return getApp();
    }

    // Config for Dashboard (Project A - Default)
    if (!name) {
        const {
            FIREBASE_PROJECT_ID,
            FIREBASE_CLIENT_EMAIL,
            FIREBASE_PRIVATE_KEY,
        } = process.env;

        if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
            // Check if we have the necessary environment variables
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

        return initializeApp({
            credential: cert({
                projectId: FIREBASE_PROJECT_ID,
                clientEmail: FIREBASE_CLIENT_EMAIL,
                privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });
    }

    // Config for School App (Project B)
    if (name === "SCHOOL_APP") {
        const {
            SCHOOL_APP_PROJECT_ID,
            SCHOOL_APP_CLIENT_EMAIL,
            SCHOOL_APP_PRIVATE_KEY,
        } = process.env;

        if (!SCHOOL_APP_PROJECT_ID || !SCHOOL_APP_CLIENT_EMAIL || !SCHOOL_APP_PRIVATE_KEY) {
            console.warn("School App Admin keys missing.");
            return undefined;
        }

        return initializeApp({
            credential: cert({
                projectId: SCHOOL_APP_PROJECT_ID,
                clientEmail: SCHOOL_APP_CLIENT_EMAIL,
                privateKey: SCHOOL_APP_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        }, "SCHOOL_APP");
    }

    return undefined;
}

// Dashboard App (Project A)
const dashboardApp = getFirebaseAdminApp();
const adminAuth = dashboardApp ? getAuth(dashboardApp) : null;
const adminDb = dashboardApp ? getFirestore(dashboardApp) : null;

// School App (Project B)
const schoolApp = getFirebaseAdminApp("SCHOOL_APP");
const schoolAuth = schoolApp ? getAuth(schoolApp) : null;
const schoolDb = schoolApp ? getFirestore(schoolApp) : null;

export { adminAuth, adminDb, schoolAuth, schoolDb };

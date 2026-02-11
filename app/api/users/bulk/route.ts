import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const SCHOOL_CODE = "GRA"; // Use env var in production

// Helper function to process a single user
async function processUser(user: any) {
    try {
        const {
            role,
            name,
            email,
            phone,
            admissionNumber,
            class: className,
            section,
            rollNumber,
            parentPhone,
            employeeId,
            subject
        } = user;

        if (!role || !name) {
            return { success: false, error: "Missing required fields (role, name)", user };
        }

        let password = "";
        let finalEmail = email;
        let uniqueId = "";

        if (role === "student") {
            if (!admissionNumber) {
                return { success: false, error: "Missing Admission Number", user };
            }
            uniqueId = admissionNumber;
            password = `${SCHOOL_CODE}@${admissionNumber}`;
            if (!finalEmail) {
                finalEmail = `${admissionNumber}@greenfield.edu`.toLowerCase();
            }
        } else if (role === "teacher") {
            if (!employeeId) {
                return { success: false, error: "Missing Employee ID", user };
            }
            uniqueId = employeeId;
            password = `${SCHOOL_CODE}@${employeeId}`;
            if (!finalEmail) {
                return { success: false, error: "Missing Email for teacher", user };
            }
        } else {
            return { success: false, error: "Invalid role", user };
        }

        // Check if user already exists in Auth to avoid error
        try {
            await adminAuth!.getUserByEmail(finalEmail);
            return { success: false, error: `User with email ${finalEmail} already exists`, user };
        } catch (error: any) {
            if (error.code !== 'auth/user-not-found') {
                throw error;
            }
            // User doesn't exist, proceed
        }

        // Create Auth User
        const userRecord = await adminAuth!.createUser({
            email: finalEmail,
            password: password,
            displayName: name,
        });

        const userData: any = {
            role,
            schoolId: SCHOOL_CODE,
            name,
            email: finalEmail,
            createdAt: new Date().toISOString(),
            phone: phone || null,
        };

        if (role === "student") {
            userData.admissionNumber = admissionNumber;
            userData.class = className;
            userData.section = section;
            userData.rollNumber = rollNumber;
            userData.parentPhone = parentPhone;
        } else if (role === "teacher") {
            userData.employeeId = employeeId;
            userData.subject = subject;
        }

        await adminDb!.collection("users").doc(userRecord.uid).set(userData);

        return {
            success: true,
            user: { ...user, uid: userRecord.uid, generatedPassword: password, generatedEmail: finalEmail }
        };

    } catch (error: any) {
        return { success: false, error: error.message, user };
    }
}

export async function POST(request: Request) {
    try {
        if (!adminAuth || !adminDb) {
            return NextResponse.json(
                { error: "Firebase Admin not initialized." },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { users } = body; // Expecting { users: [...] }

        if (!Array.isArray(users)) {
            return NextResponse.json({ error: "Invalid data format. Expected 'users' array." }, { status: 400 });
        }

        const results = [];
        const successes = [];
        const failures = [];

        // Process sequentially to be safe with rate limits, or Promise.all for speed.
        // For specific requirement "Progress indicator", client might want stream or separate calls.
        // But requirement says "Show summary: Total, Success, Failed". 
        // We will process all and return summary. Users array is likely < 500.

        for (const user of users) {
            // Basic normalization
            // Ensure role is lowercase
            if (user.role) user.role = user.role.toLowerCase();

            const result = await processUser(user);
            results.push(result);
            if (result.success) {
                successes.push(result);
            } else {
                failures.push(result);
            }
        }

        return NextResponse.json({
            success: true,
            summary: {
                total: users.length,
                successCount: successes.length,
                failureCount: failures.length,
            },
            details: {
                successes,
                failures
            }
        });

    } catch (error: any) {
        console.error("Bulk upload error:", error);
        return NextResponse.json(
            { error: error.message || "Bulk upload failed" },
            { status: 500 }
        );
    }
}

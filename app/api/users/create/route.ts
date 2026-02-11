import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

// Hardcoded for now, could be dynamic or from env
const SCHOOL_CODE = "GRA";

export async function POST(request: Request) {
    console.log("API: /api/users/create called");
    try {
        // Check if initialized
        if (!adminAuth || !adminDb) {
            console.error("API Error: Firebase Admin not initialized");
            return NextResponse.json(
                { error: "Firebase Admin not initialized. Check server logs." },
                { status: 500 }
            );
        }

        // TODO: Verify Authorization header to ensure request comes from an Admin
        // const authHeader = request.headers.get("Authorization");
        // ... verify ID token ...

        const body = await request.json();
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
        } = body;

        // Validate required fields based on role
        if (!role || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let password = "";
        let finalEmail = email;
        let uniqueId = ""; // admissionNumber or employeeId used for password gen

        if (role === "student") {
            if (!admissionNumber) {
                return NextResponse.json({ error: "Admission Number is required for students" }, { status: 400 });
            }
            uniqueId = admissionNumber;
            password = `${SCHOOL_CODE}@${admissionNumber}`;

            // Auto-generate email if missing: AdmissionNumber@school.com
            if (!finalEmail) {
                finalEmail = `${admissionNumber}@greenfield.edu`.toLowerCase();
            }
        } else if (role === "teacher") {
            if (!employeeId) {
                return NextResponse.json({ error: "Employee ID is required for teachers" }, { status: 400 });
            }
            uniqueId = employeeId;
            password = `${SCHOOL_CODE}@${employeeId}`;

            if (!finalEmail) {
                return NextResponse.json({ error: "Email is required for teachers" }, { status: 400 });
            }
        } else {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        // 1. Create user in Firebase Auth
        console.log(`API: Creating user in Auth: ${finalEmail}`);
        const userRecord = await adminAuth.createUser({
            email: finalEmail,
            password: password,
            displayName: name,
        });
        console.log(`API: Auth user created: ${userRecord.uid}`);

        // 2. Create user document in 'users' collection
        // Using set with merge to be safe, though create is fine for new
        const userData: any = {
            role,
            schoolId: SCHOOL_CODE,
            name,
            email: finalEmail,
            createdAt: new Date().toISOString(),
            // Common metadata
            phone: phone || null,
        };

        // Role specific fields
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

        console.log(`API: Writing to Firestore users/${userRecord.uid}`);
        await adminDb.collection("users").doc(userRecord.uid).set(userData);
        console.log("API: Firestore write successful");

        // 3. Return credentials (so Admin can see/copy them)
        return NextResponse.json({
            success: true,
            data: {
                uid: userRecord.uid,
                email: finalEmail,
                password: password, // Returning this ONLY here for the initial "Copy Credentials" modal
                role,
                name
            }
        });

    } catch (error: any) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create user" },
            { status: 500 }
        );
    }
}

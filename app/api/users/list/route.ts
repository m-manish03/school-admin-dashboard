import { NextResponse } from "next/server";
import { schoolDb } from "@/lib/firebase-admin";

export async function GET(request: Request) {
    try {
        if (!schoolDb) {
            return NextResponse.json(
                { error: "School App Admin not initialized." },
                { status: 500 }
            );
        }

        // Ideally we should implement pagination here using query parameters
        // For now, fetching all users (capped at a reasonable limit for dashboard)
        const usersSnapshot = await schoolDb.collection("users")
            // .orderBy("createdAt", "desc") // Requires index, optional for now
            .limit(100)
            .get();

        const users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort manually if no index exists yet
        users.sort((a: any, b: any) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        return NextResponse.json({ users });

    } catch (error: any) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch users" },
            { status: 500 }
        );
    }
}

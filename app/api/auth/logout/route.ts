import { NextResponse } from "next/server";

import { User } from "@/models/user";
import { connectDB } from "@/configs/database";


// Login
export async function POST(request: Request) {
    try {
        await connectDB();

        // Parse the request body
        const body = await request.json();
        const { id } = body || {};

        // Validate required fields
        if (!id) {
            return NextResponse.json({ error: "User ID is required for logout" }, { status: 400 });
        }

        // Check if user exists
        const user = await User.findOne({ _id: id });
        if (!user) {
            return NextResponse.json({ error: "User not found with this id." }, { status: 404 });
        }

        // Clear the user's token
        user.token = undefined;

        // Update user token
        await user.save();

        // Return a success response with user details
        return NextResponse.json({ message: "Logout successfully" }, { status: 201 });
    } catch (error) {
        console.error(error);

        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
};
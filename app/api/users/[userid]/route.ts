import { NextRequest, NextResponse } from "next/server";

import auth from "@/middlewares/auth";
import { connectDB } from "@/configs/database";
import { User } from "@/models/user";


const middleware = auth(["admin"]);


// Get User by ID
export const GET = async (request: NextRequest, { params }: { params: { userId: string } }) => {
    // Extract the user ID and validate it
    const { userId } = await params;
    if (!userId || userId.trim() === "") {
        return NextResponse.json({ error: "Please provide a valid user ID" }, { status: 400 });
    }

    // Authentication middleware
    const authResponse = await middleware(request);
    if (!authResponse.success) return authResponse.response;

    try {
        // Database connection
        await connectDB();

        // Fetch user by ID
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "No user found with this ID" }, { status: 404 });
        }

        // Return the user data
        return NextResponse.json({
            message: "User fetched successfully",
            user
        }, { status: 200 });
    } catch (error: any) {
        console.error(error);

        // Handle ObjectId cast errors
        if (error.name === "CastError" && error.kind === "ObjectId") {
            return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
        }

        // Handle other errors
        return NextResponse.json({ error: "Something went wrong. Please try again later or contact support at contact@techieonix.com" }, { status: 500 });
    }
};


// Delete User by ID
export const DELETE = async (request: NextRequest, { params }: { params: { userId: string } }) => {
    // Extract the user ID and validate it
    const { userId } = await params;
    if (!userId || userId.trim() === "") {
        return NextResponse.json({ error: "Please provide a valid user ID" }, { status: 400 });
    }

    // Authentication middleware
    const authResponse = await middleware(request);
    if (!authResponse.success) return authResponse.response;

    try {
        // Database connection
        await connectDB();

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return NextResponse.json({ error: "No user found with this ID" }, { status: 404 });
        }

        // Return success response
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error(error);

        // Handle ObjectId cast errors
        if (error.name === "CastError" && error.kind === "ObjectId") {
            return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
        }

        // Handle other errors
        return NextResponse.json({ error: "Something went wrong. Please try again later or contact support at contact@techieonix.com" }, { status: 500 });
    }
};
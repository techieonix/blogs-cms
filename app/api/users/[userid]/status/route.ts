import { NextRequest, NextResponse } from "next/server";

import auth from "@/middlewares/auth";
import { User } from "@/models/user";


const middleware = auth(["admin"]);


export const PATCH = async (request: NextRequest, { params }: { params: { userId: string } }) => {
    // Extract the user ID and validate it
    const { userId } = await params;
    if (!userId || userId.trim() === "") {
        return NextResponse.json({ error: "Please provide a valid user ID" }, { status: 400 });
    }

    // Authentication middleware
    const authResponse = await middleware(request);
    if (!authResponse.success) return authResponse.response;

    try {
        // Parse the request body
        const { isActive } = await request.json();
        if (isActive === null || isActive === undefined || typeof isActive !== "boolean") {
            return NextResponse.json({ error: "Please provide the valid status" }, { status: 400 });
        }

        // Update user by ID
        const user = await User.findByIdAndUpdate(userId, { $set: { isActive } }, { new: true });

        if (!user) {
            return NextResponse.json({ error: "No user found with this ID" }, { status: 404 });
        }

        // Return the updated user data
        return NextResponse.json({
            message: `User has been ${isActive ? "activated" : "deactivated"} successfully`,
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
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user";


// Get User by ID
export const getUser = async (userId: string) => {
    try {
        // Fetch user by ID
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "No user found with this ID" }, { status: 404 })
        }

        // Return the user data
        return NextResponse.json({ message: "User fetched successfully", user }, { status: 200 })
    } catch (error: any) {
        console.error(error);

        // Handle ObjectId cast errors
        if (error.name === "CastError" && error.kind === "ObjectId") {
            return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
        }

        // Handle other errors
        return NextResponse.json({ error: "Something went wrong. Please try again later or contact support at contact@techieonix.com" }, { status: 500 })
    }
};


// Delete User by ID
export const deleteUser = async (userId: string) => {
    try {
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


// Update User by ID
export const updateUser = async (request: NextRequest, userId: string) => {
    // Parse the request body
    const body = await request.json();

    // Validate request body
    const notAllowedFields = ["email", "password", "role", "isActive", "token", "forgotPasswordToken"];
    const isValid = Object.keys(body).some(field => notAllowedFields.includes(field));
    if (isValid) {
        return NextResponse.json({ error: "Invalid fields in request body. You can only update name, bio, and avatar." }, { status: 400 });
    }

    try {
        if ("avatar" in body) {
            // Handle avatar here
        }

        // Update user by ID
        const user = await User.findByIdAndUpdate(userId, { $set: body }, { new: true });
        if (!user) {
            return NextResponse.json({ error: "No user found with this ID" }, { status: 404 });
        }

        // Return the updated user data
        return NextResponse.json({
            message: "User updated successfully",
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
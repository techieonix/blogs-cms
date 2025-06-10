import { NextRequest, NextResponse } from "next/server";

import auth from "@/middlewares/auth";
import { deleteUser, getUser, updateUser } from "@/utilities/user";


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

    // Fetch user by ID bt utility function
    const response = await getUser(userId);
    return response;
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

    // Delete user by ID bt utility function
    const response = await deleteUser(userId);
    return response;
};


// // Update User by ID
export const PUT = async (request: NextRequest, { params }: { params: { userId: string } }) => {
    // Extract the user ID and validate it
    const { userId } = await params;
    if (!userId || userId.trim() === "") {
        return NextResponse.json({ error: "Please provide a valid user ID" }, { status: 400 });
    }

    // Authentication middleware
    const authResponse = await middleware(request);
    if (!authResponse.success) return authResponse.response;

    // Update user by ID bt utility function
    const response = await updateUser(request, userId);
    return response;
};
import { NextRequest, NextResponse } from "next/server";

import auth from "@/middlewares/auth";
import { User } from "@/models/user";


const middleware = auth(["admin"]);

export const GET = async (request: NextRequest) => {
    try {
        // Authentication middleware
        const authResponse = await middleware(request);
        if (!authResponse.success) return authResponse.response;

        // Fetch all users
        const users = await User.find();
        if (users.length === 0) {
            return NextResponse.json({ message: "No users found." }, { status: 404 });
        }

        // Return the list of users with success response
        return NextResponse.json({ users, message: "Users fetched successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong. Please try again later or contact support at contact@techieonix.com" }, { status: 500 });
    }
};
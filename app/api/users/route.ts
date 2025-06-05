import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/configs/database";
import auth from "@/middlewares/auth";
import { User } from "@/models/user";


export const GET = async (request: NextRequest) => {
    try {
        // Database connection
        await connectDB();

        // Authentication middleware
        await auth(request, ["admin"]);

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
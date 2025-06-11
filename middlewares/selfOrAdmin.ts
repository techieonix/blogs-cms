import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/configs/database";
import { User } from "@/models/user";


export default async function (request: NextRequest, userId: string) {
    try {
        // Extract the token from the request headers
        const token = request.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return {
                success: false,
                response: NextResponse.json({ message: "No token provided. Please log in to continue." }, { status: 401 })
            };
        }

        // Decode the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as {
            id: string;
            role: string;
            name: string;
            email: string;
        };

        // Validate the user ID and role
        if (decoded.role !== "admin" && decoded.id !== userId) {
            return {
                success: false,
                response: NextResponse.json({ message: "You do not have permission to access this resource." }, { status: 403 })
            };
        }

        // Database Connection
        await connectDB();

        // Check if user exists and is active
        const user = await User.findOne({ _id: decoded.id, isActive: true });
        if (!user) {
            return {
                success: false,
                response: NextResponse.json({ message: "User not found or inactive. Please log in again to continue or contact support at contact@techieonix.com." }, { status: 404 })
            };
        }

        console.log("Authentication successful");
        return {
            success: true,
            user
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            response: NextResponse.json({ message: "Invalid or expired token. Please log in again to continue." }, { status: 401 })
        };

    }
}
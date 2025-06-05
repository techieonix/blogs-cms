import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "@/models/user";
import { connectDB } from "@/configs/database";


// Login
export async function POST(request: Request) {
    try {
        await connectDB();

        // Parse the request body
        const body = await request.json();
        const { email, password, rememberMe } = body || {};

        // Validate required fields
        if (!email) {
            return NextResponse.json({ error: "Please provide an email" }, { status: 400 });
        }
        if (!password) {
            return NextResponse.json({ error: "Please provide a password" }, { status: 400 });
        }

        // Check if user exists
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return NextResponse.json({ error: "User not found with this email. Please check your email or sign up." }, { status: 404 });
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password. Please try again." }, { status: 401 });
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                name: user.name,
                email,
                role: body.role || "viewer"
            },
            process.env.SECRET_KEY!,
            { expiresIn: rememberMe ? "5d" : "1d" }
        );

        // Update user token
        await user.save();

        // Return a success response with user details
        return NextResponse.json({
            message: "Login successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role
            }
        }, { status: 201 });
    } catch (error) {
        console.error(error);

        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
};
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "@/models/user";
import { connectDB } from '@/configs/database';


export const PUT = async (req: NextRequest) => {
    // Extract the token from the request query
    const token = new URL(req.url).searchParams.get("token");
    if (!token) {
        return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    try {
        // Decode the token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as
            { name: string, email: string, role: string | null, iat: number, exp: number, password: string, rememberMe: boolean };

        // Check if the decoded token is missing
        if (!decodedToken) {
            return NextResponse.json({ error: "Token missing" }, { status: 400 });
        }

        // Encrypt the password
        const saltRounds = parseInt(process.env.SALT_ROUNDS || "");
        const hashedPassword = await bcrypt.hash(decodedToken.password, saltRounds);


        const { iat, exp, ...body } = decodedToken;

        const newToken = jwt.sign(
            { name: body.name, email: body.email, role: body.role || "reader" },
            process.env.SECRET_KEY!,
            { expiresIn: body.rememberMe ? "5d" : "1d" }
        );

        // Database connection
        await connectDB();

        // Create and save a new user instance
        const user = new User({ ...body, password: hashedPassword, token, verified: true });
        await user.save();

        // Return a success response with user details
        return NextResponse.json({ message: "Signup successful. Please log in to continue.", token: newToken }, { status: 201 });

    } catch (error: unknown) {
        console.error(error);

        // Type guard to check if error is an object with a name property
        if (error && typeof error === 'object' && 'name' in error) {
            // Handle token expiration error
            if (error.name === "TokenExpiredError") {
                return NextResponse.json({ error: "Token has expired. Please request a new verification link." }, { status: 401 });
            }

            // Handle invalid token error
            if (error.name === "JsonWebTokenError") {
                return NextResponse.json({ error: "Invalid token. Please request a new verification link." }, { status: 400 });
            }
        }

        // Handle other errors
        return NextResponse.json({ error: "Something went wrong. Please try again later or contact support at contact@techieonix.com." }, { status: 500 });
    }
};
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { User } from "@/models/user";


export const PUT = async (req: NextRequest) => {
    // Extract the token from the request query
    const token = new URL(req.url).searchParams.get("token");
    if (!token) {
        return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    try {
        // Decode the token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as { _id: string, iat: number, exp: number };
        if (!decodedToken || !decodedToken._id) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        // Check if the token has expired
        if (decodedToken.iat > decodedToken.exp) {
            return NextResponse.json({ error: "Token has expired" }, { status: 401 });
        }

        // Fetch user details using the decoded token
        const user = await User.findById(decodedToken._id);
        if (!user) {
            return NextResponse.json({ error: "User not found with this ID." }, { status: 404 });
        }

        // Check if the user is already verified
        if (user.verified) {
            return NextResponse.json({ message: "User is already verified." }, { status: 200 });
        }

        // Update user verification status and remove the verification token
        user.verified = true;
        user.verificationToken = undefined;
        await user.save();

        return NextResponse.json({ message: "Your email has been successfully verified." }, { status: 200 });
    } catch (error: unknown) {
        console.error(error);

        // Handle specific JWT expiration error
        if (typeof error === 'object' && error !== null && 'name' in error && error.name === "TokenExpiredError") {
            return NextResponse.json({ error: "Token has expired" }, { status: 401 });
        }

        // Handle other errors
        return NextResponse.json({ error: "Something went wrong. Please try again or contact our support at contact@techieonix.com." }, { status: 500 });
    }
};
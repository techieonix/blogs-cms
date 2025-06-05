import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "@/models/user";

export const PUT = async (request: NextRequest) => {
    // Extract the token from the request query
    const token = new URL(request.url).searchParams.get("token");
    if (!token) {
        return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const { password } = await request.json();

    try {
        // Decode the token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as { id: string };
        if (!decodedToken) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // Check if the token is valid with datbase
        const user = await User.findById(decodedToken.id);
        if (!user || user.forgotPasswordToken !== token) {
            return NextResponse.json({ error: "You can not update the password with this token. Please request a new verification link." }, { status: 400 });
        }

        // Encrypt the password
        const saltRounds = parseInt(process.env.SALT_ROUNDS || "");
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update the user's password and clear the forgot password token
        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        await user.save();

        return NextResponse.json({ message: "Password reset successfully. You can now log in with your new password." }, { status: 200 });
    } catch (error) {
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
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export default async function (req: NextRequest, allowedRoles: string[]) {
    // Extract the token from headers
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) {
        return NextResponse.json({ message: "No token provided. Please log in to continue." }, { status: 401 });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
        if (allowedRoles && !allowedRoles.includes(decodedToken.role)) {
            return NextResponse.json({ message: "You do not have permission to access this resource." }, { status: 403 });
        }

        req.headers.set("user", JSON.stringify(decodedToken));

        // Continue normally
        return NextResponse.next();
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
        return NextResponse.json({ message: "Something went wrong. Please try again later or contact support at contact@techieonix.com" }, { status: 500 });
    }
};
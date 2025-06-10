import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export default function (allowedRoles: string[]) {
    return async (request: NextRequest) => {
        const token = request.headers.get("Authorization")?.split(" ")[1];

        // No token block
        if (!token) {
            return {
                success: false,
                response: NextResponse.json({ message: "No token provided. Please log in to continue." }, { status: 401 })
            };
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY!) as {
                id: string;
                role: string;
                name: string;
                email: string;
            };

            // Role validation
            if (!allowedRoles.includes(decoded.role)) {
                return {
                    success: false,
                    response: NextResponse.json({ message: "You do not have permission to access this resource." }, { status: 403 })
                };
            }

            console.log("Authentication successful");
            return {
                success: true,
                user: {
                    id: decoded.id,
                    name: decoded.name,
                    email: decoded.email,
                    role: decoded.role
                }
            };

        } catch (error) {
            console.error(error);
            return {
                success: false,
                response: NextResponse.json({ message: "Invalid or expired token" }, { status: 401 })
            };
        }
    };
};
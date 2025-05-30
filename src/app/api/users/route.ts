import { User } from "@/src/models/user";
import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "../../configs/database";

connectDb();

export interface GetRequest extends NextRequest {}

export function GET(request: GetRequest): NextResponse {
    const users = [
        {
            id: 1,
            name: "John Doe",
            email: "john@gmail.com",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@gmail.com",
        }
    ]
    return NextResponse.json(users, { status: 200 });
}

export async function POST(request: Request) {
    const {name, email, password, role} = await request.json();

    const user = new User({
        name,
        email,
        password,
        role
    });

    try {
        await user.save();
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}
import { NextResponse, NextRequest } from "next/server";

import { Blog } from "@/models/blog";
import { connectDB } from "@/configs/database";
import auth from "@/middlewares/auth";


const getMiddleware = auth(["admin", "viewer", "author"]);
const postMiddleware = auth(["admin", "author"]);


// Get all published blogs
export async function GET(request: NextRequest) {
    // Authentication middleware
    const authResponse = await getMiddleware(request);
    if (!authResponse.success) return authResponse.response;

    try {
        // Fetch all blogs
        const blogs = await Blog.find({ status: "Published" });
        if (!blogs || blogs.length === 0) {
            return NextResponse.json({ message: "No blogs found" }, { status: 404 });
        }

        // Return the blogs
        return NextResponse.json({
            message: "Blogs fetched successfully",
            blogs
        }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// Create a new blog
export async function POST(request: NextRequest) {
    // Authentication middleware
    const authResponse = await postMiddleware(request);
    if (!authResponse.success) return authResponse.response;

    try {
        // Create and save a new blog
        const blog = new Blog({ author: authResponse.user._id });
        await blog.save();

        // Return a success response
        return NextResponse.json({ message: "Blog created successfully" }, { status: 201 });
    } catch (error) {
        console.error(error);

        // Handle validation errors
        if (error instanceof Error && error.name === "ValidationError") {
            return NextResponse.json({ error: (error as Error).message.split(": ").at(-1) }, { status: 400 });
        }

        return NextResponse.json({ error: "Something went wrong. Please try again later or contact support at contact@techieonix.com." }, { status: 500 });
    }
}
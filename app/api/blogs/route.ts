import { NextResponse, NextRequest } from "next/server";
import { Blog } from "@/models/blog";
import { connectDB } from "@/configs/database";


// Get all blogs
export async function GET(request: NextResponse) {
    try {
        // Database connection
        await connectDB();

        // Fetch all blogs
        const blogs = await Blog.find();
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
    const body = await request.json();

    try {
        // Database connection
        await connectDB();

        // Create and save a new blog
        const blog = new Blog(body);
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
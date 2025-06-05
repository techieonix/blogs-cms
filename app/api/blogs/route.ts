import { Blog } from "@/models/blog";
import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "../../../configs/database";

connectDb();

// export interface GetRequest extends NextRequest {}

// Get all blogs
// export async function GET(request: GetRequest) {
//     await connectDb();
//     const { searchParams } = new URL(request.url);
//     const blogId = searchParams.get("id");

//     try {
//         if (blogId) {
//             const blog = await Blog.findById(blogId);
//             if (!blog) {
//                 return NextResponse.json({ error: "Blog not found" }, { status: 404 });
//             }
//             return NextResponse.json(blog, { status: 200 });
//         } else {
//             const blogs = await Blog.find();
//             return NextResponse.json(blogs, { status: 200 });
//         }
//     } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : String(error);
//         return NextResponse.json({ error: errorMessage }, { status: 500 });
//     }
// }

// Create a new blog
export async function POST(request: NextRequest) {
    const body = await request.json();

    try {
        // Database connection
        await connectDb();

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
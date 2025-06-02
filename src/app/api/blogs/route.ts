import { Blog } from "@/src/models/blog";
import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "../../configs/database";

connectDb();

export interface GetRequest extends NextRequest {}

// Get all blogs
export async function GET(request: GetRequest) {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("id");

    try {
        if (blogId) {
            const blog = await Blog.findById(blogId);
            if (!blog) {
                return NextResponse.json({ error: "Blog not found" }, { status: 404 });
            }
            return NextResponse.json(blog, { status: 200 });
        } else {
            const blogs = await Blog.find();
            return NextResponse.json(blogs, { status: 200 });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// Create a new blog
export async function POST(request: Request) {
    await connectDb();
    let body;

    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { title, thumbnail, category, authorName, content, published=false, publishedDate, tags=[], status="draft", authorId } = body || {};

    if (!title || !thumbnail || !category || !authorName || !content || !publishedDate || !authorId) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const blog = new Blog({ title, thumbnail, category, authorName, content, published, publishedDate:new Date(publishedDate), updatedDate: new Date(), tags, status, authorId });

    try {
        await blog.save();
        return NextResponse.json(blog, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}

// Update a blog by ID
export async function PUT(request: Request, { params }: { params: { blogId: string } }) {
    await connectDb();
    const { blogId } = params;
    let body;

    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { title, content, author } = body || {};

    if (!title || !content || !author) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, { title, content, author }, { new: true });
        if (!updatedBlog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }
        return NextResponse.json(updatedBlog, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}

// Delete a blog by ID
export async function DELETE(request: Request, { params }: { params: { blogId: string } }) {
    await connectDb();
    const { blogId } = params;

    try {
        const deletedBlog = await Blog.findByIdAndDelete(blogId);
        if (!deletedBlog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}
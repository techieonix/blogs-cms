import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import { connectDb } from "@/configs/database";
import { Blog } from "@/models/blog";

//Edit Blog
export async function PATCH(request: NextRequest, { params }: { params: { blogid: string } }) {
    const blogId = await params.blogid;

    if (!Types.ObjectId.isValid(blogId)) {
        return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    let updatedData = await request.json();
    updatedData.lastUpdateDate = new Date(Date.now());
    try {
        // Database connection
        await connectDb();

        // Update the blog
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedData, { new: true });
        if (!updatedBlog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        // Return a success response
        return NextResponse.json({ message: "Blog updated successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);

        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}

// Delete Blog
export async function DELETE(_: NextRequest, { params }: { params: { blogid: string } }) {
    const blogId = await params.blogid;

    if (!Types.ObjectId.isValid(blogId)) {
        return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    try {
        // Database connection
        await connectDb();

        // Delete the blog
        const deletedBlog = await Blog.findByIdAndDelete(blogId);
        if (!deletedBlog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);

        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
};
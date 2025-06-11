import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import { connectDB } from "@/configs/database";
import { Blog } from "@/models/blog";
import selfOrAdmin from "@/middlewares/selfOrAdmin";


// Get Blog by ID
export async function GET(request: NextRequest, { params }: { params: { blogId: string } }) {
    // Extract the blog ID
    const { blogId } = await params;
    if (!Types.ObjectId.isValid(blogId)) {
        return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    try {
        // Database connection
        await connectDB();

        // Fetch the blog by ID
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return NextResponse.json({ error: "No blog found with this ID" }, { status: 404 });
        }

        // Break if the blog is not published and the user is not the author or an admin
        if (blog.status !== "Published") {
            const authResponse = await selfOrAdmin(request, blog.author.toString());
            if (!authResponse.success) return authResponse.response;
        }

        // Return the blog data
        return NextResponse.json({
            message: "Blog fetched successfully",
            blog
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong. Please try again later or contact support at contact@techieonix.com" }, { status: 500 });
    }
}


//Edit Blog
export async function PATCH(request: NextRequest, { params }: { params: { blogId: string } }) {
    const { blogId } = await params;

    if (!Types.ObjectId.isValid(blogId)) {
        return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    let updatedData = await request.json();
    updatedData.lastUpdateDate = new Date(Date.now());
    try {
        // Database connection
        await connectDB();

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
export async function DELETE(_: NextRequest, { params }: { params: { blogId: string } }) {
    const { blogId } = await params;

    if (!Types.ObjectId.isValid(blogId)) {
        return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    try {
        // Database connection
        await connectDB();

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
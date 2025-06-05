import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/configs/database";
import { Blog } from "@/models/blog";
import { Types } from "mongoose";

//Edit Blog
export async function PATCH(request: NextRequest, {params}: {params: {blogid: string}}) {
    await connectDb();
    const blogId = await params.blogid;
    
    if (!Types.ObjectId.isValid(blogId)) {
        return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }
 
    let updatedData = await request.json();
    updatedData.updatedDate = new Date();
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedData, { new: true });
        if (!updatedBlog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }
        return NextResponse.json(updatedBlog, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}

// Delete Blog
export async function DELETE(request: NextRequest, {params}: {params: {blogid: string}}) {
    await connectDb();
    const blogId = await params.blogid;

    if (!Types.ObjectId.isValid(blogId)) {
        return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

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
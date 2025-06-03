import { NextResponse } from "next/server";
import { connectDb } from "@/src/app/configs/database";
import { Blog } from "@/src/models/blog";
import { Types } from "mongoose";

// Get Blog ID from URL
function getBlogIdFromParams(params: any) {
    return params?.id;
}

//Edit Blog
export async function PATCH(request: Request, {params}: {params: {id: string}}) {
    await connectDb();
    const blogId = getBlogIdFromParams(params);
    if (!Types.ObjectId.isValid(blogId)) {
        return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    let updatedData;
    try {
        updatedData = await request.json();
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

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
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await connectDb();
    const blogId = getBlogIdFromParams(params);
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
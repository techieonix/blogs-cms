import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/configs/database";
import { Blog } from "@/models/blog";
import mongoose from "mongoose";

export async function POST(
  request: NextRequest,
  { params }: { params: { blogid: string } }
) {
  await connectDB();

  const blogId = await params.blogid;

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }

  const { userId, comment } = body;

  if (!userId || !comment) {
    return NextResponse.json(
      { error: "User ID and comment are required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const newComment = {
      userId,
      comment,
      createdAt: new Date(),
    };
    blog.comments.push(newComment);
    await blog.save();
    return NextResponse.json(
      { meesage: "Comment added successfully", comment: newComment },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

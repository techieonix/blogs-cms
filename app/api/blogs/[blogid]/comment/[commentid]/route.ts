import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "@/configs/database";
import { Blog } from "@/models/blog";
import mongoose from "mongoose";

// Update a comment by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { blogid: string; commentid: string } }
) {
  await connectDb();

  const blogId = params.blogid;
  const commentId = params.commentid;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }

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

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const newComment = blog.comments.id(commentId);
    if (!newComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (newComment.userId.toString() !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to edit this comment" },
        { status: 403 }
      );
    }

    newComment.comment = comment;
    newComment.updatedAt = new Date();

    await blog.save();
    return NextResponse.json(
      { message: "Comment updated successfully", comment: newComment },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Delete a comment by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { blogid: string; commentid: string } }
) {
  await connectDb();

  const blogId = params.blogid;
  const commentId = params.commentid;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const commentToDelete = blog.comments.id(commentId);
    if (!commentToDelete) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    blog.comments = blog.comments.filter(
      (c: any) => c._id.toString() !== commentId
    );
    await blog.save();
    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

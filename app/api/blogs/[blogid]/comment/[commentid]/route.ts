import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/configs/database";
import { Blog } from "@/models/blog";
import { Comment } from "@/models/comment";
import mongoose from "mongoose";

// Update a comment by ID
export async function PUT(request: NextRequest, { params }: { params: { commentid: string } }) {
  await connectDB();
  const { commentid } = params;
  const { userId, comment } = await request.json();

  const existing = await Comment.findById(commentid);
  if (!existing) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  if (existing.userId.toString() !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  existing.comment = comment;
  existing.updatedAt = new Date();
  await existing.save();

  return NextResponse.json({ message: "Comment updated", comment: existing }, { status: 200 });
}


// Delete a comment by ID
export async function DELETE(request: NextRequest, { params }: { params: { commentid: string } }) {
  await connectDB();
  const { commentid } = params;

  const comment = await Comment.findById(commentid);
  if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

  await Comment.findByIdAndDelete(commentid);
  await Blog.findByIdAndUpdate(comment.blogId, { $inc: { commentsCount: -1 } });

  return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
}
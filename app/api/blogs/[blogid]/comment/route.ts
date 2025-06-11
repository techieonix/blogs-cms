import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/configs/database";
import { Blog } from "@/models/blog";
import { Comment } from "@/models/comment";


export async function POST(request: NextRequest, { params }: { params: { blogid: string } }) {
  await connectDB();
  
  const blogId = params.blogid;
  const { userId, comment } = await request.json();

  if (!userId || !comment) {
    return NextResponse.json({ error: "User ID and comment are required" }, { status: 400 });
  }

  const newComment = await Comment.create({ blogId, userId, comment });

  await Blog.findByIdAndUpdate(blogId, { $inc: { commentsCount: 1 } });

  return NextResponse.json({ message: "Comment added", comment: newComment }, { status: 201 });
}


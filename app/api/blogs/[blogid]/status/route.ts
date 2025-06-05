import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/configs/database";
import { Blog } from "@/models/blog";

export async function PUT(request: NextRequest, { params }: { params: { blogid: string } }) {
  await connectDb();
  const blogId = params.blogid;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { status } = body;

  const validStatuses = ["Draft", "Published", "Archived"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    blog.status = status;
    await blog.save();
    return NextResponse.json({ message: "Blog status updated successfully" }, { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog status:", error);
    return NextResponse.json({ error: "Failed to update blog status" }, { status: 500 }
    );
  }
}

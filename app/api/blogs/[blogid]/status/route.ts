import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/configs/database";
import { Blog } from "@/models/blog";


export async function PUT(request: NextRequest, { params }: { params: { blogid: string } }) {
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

  try {
    // Database connection
    await connectDB();

    // Find the blog 
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Update the blog status
    blog.status = status;
    await blog.save();

    // Return success response
    return NextResponse.json({ message: "Blog status updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error(error);

    // Validation error handling
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message.split(": ").at(-1) }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json({ error: "Something went wrong. Please try again later or contact support at contact@techieonix.com." }, { status: 500 });
  }
};
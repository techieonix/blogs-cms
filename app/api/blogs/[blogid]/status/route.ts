import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/configs/database";
import { Blog } from "@/models/blog";
import selfOrAdmin from "@/middlewares/selfOrAdmin";


export async function PUT(request: NextRequest, { params }: { params: { blogId: string } }) {
  // Fetch id from params
  const { blogId } = await params;
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  // Parse status from request body
  const { status } = await request.json();

  try {
    // Database connection
    await connectDB();

    // Find the blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "No blog found with this ID" }, { status: 404 });
    }

    // Authentication middleware
    const authResponse = await selfOrAdmin(request, blog.author.toString());
    if (!authResponse.success) return authResponse.response;

    // Update the blog status
    blog.status = status;
    await blog.save();

    // Return success response
    return NextResponse.json({ message: `Blog is now ${status.toLowerCase()}` }, { status: 200 });
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
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/configs/database';
import { Blog } from '@/models/blog';

export async function PUT(request: NextRequest, { params }: { params: { blogid: string } }) {
  await connectDB();
  const blogId = params.blogid;

    if (!blogId) {
        return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    try {
        const blog = await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } }, { new: true });
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Views updated successfully', views: blog.views }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/configs/database';
import { Blog } from '@/models/blog';

export async function PUT(request: NextRequest, { params }: { params: { blogid: string } }) {
  await connectDB();
  const blogId = await params.blogid;
  const { userId } = await request.json();

    if (!blogId) {
        return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }
    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }
        const hasLiked = blog.likedBy.includes(userId);
        if (hasLiked) {
            // User has already liked the blog, so we remove the like
            blog.likes -= 1;
            blog.likedBy = blog.likedBy.pull(userId);
        } else {
            // User has not liked the blog, so we add the like
            blog.likes += 1;
            blog.likedBy.push(userId);
        }

        await blog.save();

        return NextResponse.json({
            message: hasLiked ? "Like removed" : "Like added",
            likes: blog.likes,
    });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
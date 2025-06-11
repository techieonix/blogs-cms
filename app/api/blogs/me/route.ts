import { NextRequest, NextResponse } from "next/server";

import auth from "@/middlewares/auth";
import { Blog } from "@/models/blog";


const middleware = auth(["admin", "viewer", "author"]);


export const GET = async (request: NextRequest) => {
    const authResponse = await middleware(request);
    if (!authResponse.success) return authResponse.response;

    try {
        // Fetch the blogs for the authenticated user
        const user = authResponse.user;
        const blogs = await Blog.find({ author: user._id });
        if (!blogs || blogs.length === 0) {
            return NextResponse.json({ message: "No blogs found for this user" }, { status: 404 });
        }

        // Group blogs by status
        const groupedBlogs = blogs.reduce((acc, blog) => {
            const key = blog.status;

            if (!acc[key]) acc[key] = [];
            acc[key].push(blog);

            return acc;
        }, {});

        // Return the grouped blogs
        return NextResponse.json({
            message: "Blogs fetched successfully",
            blogs: groupedBlogs
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong. Please try again later or contact support at contact@techieonix.com." }, { status: 500 });
    }
}
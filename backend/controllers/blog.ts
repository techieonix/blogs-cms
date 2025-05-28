import { Request, Response } from 'express';

// Extend Express Request interface to include 'user'
declare global {
    namespace Express {
        interface User {
            id: string;
            // add other user properties if needed
        }
        interface Request {
            user: User;
        }
    }
}

// Mock Blog type and DB (replace with real models/db in production)
type Blog = {
    id: string;
    title: string;
    content: string;
    authorId: string;
    published: boolean;
};

let blogs: Blog[] = [];

// Author Controllers
export const addBlog = (req: Request, res: Response) => {
    const { title, content } = req.body;
    const authorId = req.user.id; // Assume req.user is set by auth middleware
    const newBlog: Blog = {
        id: Date.now().toString(),
        title,
        content,
        authorId,
        published: false,
    };
    blogs.push(newBlog);
    res.status(201).json(newBlog);
};

export const updateBlog = (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const authorId = req.user.id;
    const blog = blogs.find(b => b.id === id && b.authorId === authorId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    blog.title = title ?? blog.title;
    blog.content = content ?? blog.content;
    res.json(blog);
};

export const deleteBlog = (req: Request, res: Response) => {
    const { id } = req.params;
    const authorId = req.user.id;
    const index = blogs.findIndex(b => b.id === id && b.authorId === authorId);
    if (index === -1) return res.status(404).json({ message: 'Blog not found' });
    blogs.splice(index, 1);
    res.status(204).send();
};

export const getMyBlogs = (req: Request, res: Response) => {
    const authorId = req.user.id;
    const myBlogs = blogs.filter(b => b.authorId === authorId);
    res.json(myBlogs);
};

// Admin Controllers
export const getAllBlogs = (_req: Request, res: Response) => {
    res.json(blogs);
};

export const publishBlog = (req: Request, res: Response) => {
    const { id } = req.params;
    const blog = blogs.find(b => b.id === id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    blog.published = true;
    res.json(blog);
};

export const deleteAnyBlog = (req: Request, res: Response) => {
    const { id } = req.params;
    const index = blogs.findIndex(b => b.id === id);
    if (index === -1) return res.status(404).json({ message: 'Blog not found' });
    blogs.splice(index, 1);
    res.status(204).send();
};

// Reader Controllers
export const getPublishedBlogs = (_req: Request, res: Response) => {
    const publishedBlogs = blogs.filter(b => b.published);
    res.json(publishedBlogs);
};

export const getBlogById = (req: Request, res: Response) => {
    const { id } = req.params;
    const blog = blogs.find(b => b.id === id && b.published);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
};
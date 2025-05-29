import { Router } from 'express';
import * as blogController from '../controllers/blog';
import { Request, Response, NextFunction } from 'express';

// Middleware placeholders for role-based access
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        role: 'admin' | 'author' | 'reader';
        // add more user properties as needed
    };
}

import { RequestHandler } from 'express';

const isAdmin: RequestHandler = (req, res, next) => { /* check admin */ next(); };
const isAuthor: RequestHandler = (req, res, next) => { /* check author */ next(); };
const isReader: RequestHandler = (req, res, next) => { /* check reader */ next(); };

const router = Router();

// Admin routes
router.get('/admin/blogs', isAdmin, blogController.getAllBlogs);
router.post('/admin/blogs', isAdmin, (req, res, next) => {
    Promise.resolve(blogController.publishBlog(req, res)).catch(next);
});
router.delete('/admin/blogs/:id', isAdmin, (req, res) => {
    blogController.deleteAnyBlog(req, res);
});

// Author routes
router.get('/author/blogs', isAuthor, blogController.getMyBlogs);
router.post('/author/blogs', isAuthor, blogController.addBlog);
router.put('/author/blogs/:id', isAuthor, (req, res, next) => {
    Promise.resolve(blogController.updateBlog(req, res)).catch(next);
});
router.delete('/author/blogs/:id', isAuthor, (req, res, next) => {
    Promise.resolve(blogController.deleteBlog(req, res)).catch(next);
});

// Reader routes
router.get('/blogs', isReader, blogController.getPublishedBlogs);
router.get('/blogs/:id', isReader, (req, res, next) => {
    Promise.resolve(blogController.getBlogById(req, res)).catch(next);
});

export default router;
import mongoose, { Schema, Document } from 'mongoose';

interface BlogContent {
    text: string;
    images: string[]; // Array of image URLs or paths
}

export interface IBlog extends Document {
    title: string;
    category: string;
    authorName: string;
    content: BlogContent;
    publishedDate: Date;
}

const BlogContentSchema: Schema = new Schema({
    text: { type: String, required: true },
    images: [{ type: String }]
});

const BlogSchema: Schema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    authorName: { type: String, required: true },
    content: { type: BlogContentSchema, required: true },
    publishedDate: { type: Date, required: true }
});

export default mongoose.model<IBlog>('Blog', BlogSchema);
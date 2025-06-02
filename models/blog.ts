import mongoose, { Schema } from "mongoose";

const BlogContentSchema: Schema = new Schema({
    text: { type: String, required: true },
    images: [{ type: String }]
});

const BlogSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    authorName: { type: String, required: true },
    content: { type: BlogContentSchema, required: true },
    publishedDate: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

export const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
import mongoose, { Schema } from "mongoose";

const BlogContentSchema: Schema = new Schema({
    text: { type: String, required: true },
    images: [{ type: String }]
});

const BlogSchema = new Schema({
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String, required: true },
    authorName: { type: String, required: true },
    content: { type: BlogContentSchema, required: true },
    published: { type: Boolean, default: false },
    publishedDate: { type: Date, required: true },
    updatedDate: { type: Date },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    shares: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
        required: true,
    },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

export const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
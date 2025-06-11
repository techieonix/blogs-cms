import { model, models, Schema } from "mongoose";
import { BlogContentSchema } from "@/models/blogContent";

const BlogSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a title for the blog post"],
        trim: true
    },
    thumbnail: String, // TBD
    category: {
        type: String,
        required: [true, "Please provide the category of the blog post"]
    },
    content: {
        type: BlogContentSchema,
        required: [true, "Please provide the content for the blog post"]
    },
    publishedDate: Date,
    lastUpdateDate: Date,
    tags: {
        type: [String],
        required: [true, "Please provide at least one tag for the blog post"],
        validate: {
            validator: function (v: string[]) {
                return v.length > 0;
            },
            message: "Please provide at least one tag for the blog post"
        }
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }],
    commmentsCount: {
        type: Number,
        default: 0  
    },
    shares: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Draft", "Published", "Archived"],
        default: "Draft"
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

export const Blog = models.Blog || model("Blog", BlogSchema);
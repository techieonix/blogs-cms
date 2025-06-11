import { model, models, Schema } from "mongoose";
import { BlogContentSchema } from "@/models/blogContent";

const BlogSchema = new Schema({
    title: {
        type: String,
        required: function (this: any) {
            return this.status === "Published";
        },
        trim: true
    },
    thumbnail: String, // TBD
    category: {
        type: String,
        required: function (this: any) {
            return this.status === "Published";
        }
    },
    content: {
        type: BlogContentSchema,
        required: function (this: any) {
            return this.status === "Published";
        }
    },
    publishedDate: Date,
    lastUpdateDate: Date,
    tags: {
        type: [String],
        required: function (this: any) {
            return this.status === "Published";
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
        required: function (this: any) {
            return this.status === "Published";
        }
    }
}, {
    timestamps: true
});

export const Blog = models.Blog || model("Blog", BlogSchema);
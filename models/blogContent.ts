import { model, models, Schema } from "mongoose";

export const BlogContentSchema = new Schema({
    text: {
        type: String,
        enum: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "blockquote", "ul", "ol", "li", "code", "image", "link", "table", "quote", "cta", "outro"],
        required: [true, "Please provide the type for the content"]
    },
    content: {
        type: String,
        required: [true, "Please provide the content for the blog post"]
    },
    styles: {
        bold: { type: Boolean, default: false },
        italic: { type: Boolean, default: false },
        underline: { type: Boolean, default: false },
        code: { type: Boolean, default: false }
    },
    images: [{ type: String, }],
    links: [{
        type: String,
        validate: {
            validator: function (v: string) {
                return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
            },
            message: "Please provide a valid URL"
        }
    }],
    tables: [{
        headers: {
            type: [String],
            required: [true, "Please provide table headers"]
        },
        rows: {
            type: [[String]],
            required: [true, "Please provide table rows"]
        }
    }],
    quote: { type: String },
    cta: {
        type: String,
        buttonLabel: String,
        buttonUrl: String
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: [true, "Please provide the blog post this content belongs to"]
    }
});

export const BlogContent = models.BlogContent || model("BlogContent", BlogContentSchema);
import { model, models, Schema } from "mongoose";

const CommentSchema = new Schema({
  blogId: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

export const Comment = models.Comment || model("Comment", CommentSchema);
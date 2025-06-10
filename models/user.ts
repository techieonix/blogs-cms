import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    bio: String,
    avatar: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "author", "viewer"],
        default: "viewer"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    token: {
        type: String,
        select: false
    },
    forgotPasswordToken: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

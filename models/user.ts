import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
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
        enum: ["admin", "writer", "reader"],
        default: "reader"
    },
    verified: {
        type: Boolean,
        default: false
    },
    token: String,
    forgotPasswordToken: String,
    verificationToken: String,
}, {
    timestamps: true
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
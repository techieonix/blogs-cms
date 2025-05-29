import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'writer', 'reader'],
        default: 'reader',
        required: true,
    },
})

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
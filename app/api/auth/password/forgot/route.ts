import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { User } from "@/models/user";
import sendEmail from "@/utilities/sendEmail";
import { connectDB } from "@/configs/database";


export const PUT = async (request: Request) => {
    const { email } = await request.json();

    // Validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format. Please provide a valid email address." }, { status: 400 });
    }

    try {
        // Database connection
        await connectDB();

        // Fetch user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found with this email." }, { status: 404 });
        }

        // Create a reset password token
        const forgotPasswordToken = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role },
            process.env.SECRET_KEY!,
            { expiresIn: 5 * 60 } // 5 minutes
        );

        // Create email requirements
        const resetLink = `http://localhost:3000/api/auth/password/reset?token=${forgotPasswordToken}`;
        const html = `<div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); max-width: 600px; margin: auto;">
  <h2 style="color: #333;">Reset Your Password</h2>
  <p style="color: #555;">We received a request to reset your password. Click the button below to set a new one:</p>
  <a href="${resetLink}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px;">Reset Password</a>
  <p style="color: #777;">If the button doesn't work, copy and paste this link into your browser:</p>
  <p style="color: #777;"><a href="${resetLink}" style="color: #4f46e5;">${resetLink}</a></p>
  <hr style="margin: 24px 0;">
  <p style="color: #ff3c3c; font-size: 12px;">This link is valid for <strong>15 minutes</strong>. For your security, do not share it with anyone.</p>
  <p style="color: #999; font-size: 12px;">If you didn't request this, you can safely ignore this email—your password will remain unchanged.</p>
</div>`;

        // Send reset password email
        const emailResponse = await sendEmail(email, "Reset Your Password", html);
        if (!emailResponse.success) {
            return NextResponse.json({ error: emailResponse.message }, { status: emailResponse.code });
        }

        // Update user with forgot password token
        user.forgotPasswordToken = forgotPasswordToken;
        await user.save();

        // Return success response
        return NextResponse.json({ message: "Password reset email sent successfully. Please check your inbox." }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong. Please try again later or contact support at contact@techieonix.com" }, { status: 500 });
    }
};
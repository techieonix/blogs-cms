// pages/api/send-email.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import sendEmail from "@/utilities/sendEmail";
import { User } from "@/models/user";
import { connectDb } from "@/configs/database";


export const POST = async (req: NextRequest) => {
    // Parse the request body
    const { userId, to } = await req.json();

    try {
        await connectDb();

        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found with this ID." }, { status: 404 });
        }

        // Create jwt token
        const jwtToken = jwt.sign(
            { _id: userId, name: user.name, email: user.email, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "15m" }
        );

        const subject = "Verify your email address";
        const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${jwtToken}`;
        const html = `<div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); max-width: 600px; margin: auto;">
  <h2 style="color: #333;">Welcome to Blog CMS 👋</h2>
  <p style="color: #555;">Thanks for signing up! Please verify your email address by clicking the button below:</p>
  <a href="${verificationLink}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px;">Verify Email</a>
  <p style="color: #777;">If the button doesn't work, copy and paste the following link into your browser:</p>
  <p style="color: #777;"><a href="${verificationLink}" style="color: #4f46e5;">${verificationLink}</a></p>
  <hr style="margin: 24px 0;">
  <p style="color: #999; font-size: 12px;">This verification link is valid for <strong>15 minutes</strong>. Please verify your email before it expires.</p>
  <p style="color: #999; font-size: 12px;">If you didn’t create an account, you can safely ignore this email.</p>
  <p style="color: #999; font-size: 12px;"><strong>Security Tip:</strong> This verification link is just for you. Please do not share it with anyone.</p>
</div>
`

        // Send the email
        const emailStatus = await sendEmail(to, subject, undefined, html);
        if (!emailStatus.success) {
            return NextResponse.json({ error: emailStatus.message }, { status: emailStatus.code });
        }

        // Update user with verification token
        user.verificationToken = jwtToken;
        await user.save();

        // Return success response
        return NextResponse.json({
            success: true,
            message: "Email sent successfully. Please check your inbox to verify your email address.",
        }, { status: 200 });

    } catch (error: any) {

        // Handle errors
        console.error("Error sending email:", error);
        return NextResponse.json({
            success: false,
            name: "EmailSendError",
            error: error.message,
        }, { status: 500 });
    }
};
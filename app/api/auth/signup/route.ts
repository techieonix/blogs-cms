import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDb } from "@/configs/database";
import sendEmail from "@/utilities/sendEmail";
import { User } from "@/models/user";


// Signup
export async function POST(request: Request) {
  try {
    await connectDb();

    // Parse the request body
    const body = await request.json();
    const { name, email, password } = body || {};

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Please provide a name" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Please provide a password" }, { status: 400 });
    }

    // Check if the email is already registered
    const IsEmailRegistered = await User.findOne({ email });
    if (IsEmailRegistered) {
      return NextResponse.json({ error: "This email is already registered. Please use a different email." }, { status: 400 });
    }

    // Generate a JWT token
    const jwtToken = jwt.sign(
      { ...body },
      process.env.SECRET_KEY!,
      { expiresIn: 15 * 60 } // 15 minutes
    );

    // Create email requirements
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
    </div>`;

    // Send the verification email
    const emailResponse = await sendEmail(email, "Verify your email address", undefined, html);
    if (!emailResponse.success) {
      return NextResponse.json({ error: emailResponse.message }, { status: emailResponse.code });
    }

    // Return a success response with user details
    return NextResponse.json(
      { message: "Email sent successfully. Please check your inbox to verify your email address." },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);

    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
};

// Update user
// export async function PUT(
//   request: Request,
//   { params }: { params: { userid: string } }
// ) {
//   await connectDb();
//   const { userid } = params;
//   let body;

//   try {
//     body = await request.json();
//   } catch (error) {
//     return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
//   }

//   const { name, email, password, role } = body || {};

//   if (!name || !email || !password || !role) {
//     return NextResponse.json(
//       { error: "All fields are required" },
//       { status: 400 }
//     );
//   }

//   try {
//     const user = await User.findByIdAndUpdate(
//       userid,
//       { name, email, password, role },
//       { new: true, runValidators: true }
//     );
//     if (!user)
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     return NextResponse.json(user, { status: 200 });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     return NextResponse.json({ error: errorMessage }, { status: 400 });
//   }
// }

// Delete user
// export async function DELETE(
//   request: Request,
//   { params }: { params: { userid: string } }
// ) {
//   await connectDb();
//   const { userid } = params;

//   try {
//     const user = await User.findByIdAndDelete(userid);
//     if (!user)
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     return NextResponse.json(
//       { message: "User deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     return NextResponse.json({ error: errorMessage }, { status: 400 });
//   }
// }

// Get user(s)
// export async function GET(
//   request: Request,
//   context?: { params?: { userid?: string } }
// ) {
//   await connectDb();
//   const userid = context?.params?.userid;

//   try {
//     if (userid) {
//       const user = await User.findById(userid);
//       if (!user)
//         return NextResponse.json({ error: "User not found" }, { status: 404 });
//       return NextResponse.json(user, { status: 200 });
//     } else {
//       const users = await User.find();
//       return NextResponse.json(users, { status: 200 });
//     }
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     return NextResponse.json({ error: errorMessage }, { status: 400 });
//   }
// };

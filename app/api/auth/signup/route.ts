import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "@/models/user";
import { connectDb } from "@/configs/database";


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
    if (!email) {
      return NextResponse.json({ error: "Please provide an email" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Please provide a password" }, { status: 400 });
    }

    // Encrypt the password
    const saltRounds = parseInt(process.env.SALT_ROUNDS || "");
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a JWT token
    const token = jwt.sign(
      {
        name, email,
        role: body.role || "reader"
      },
      process.env.SECRET_KEY,
      { expiresIn: "10d" }
    );

    // Create a new user instance
    const user = new User({ ...body, password: hashedPassword, token });

    // Save the user to the database
    await user.save();

    // Return a success response with user details
    return NextResponse.json({
      message: "Signup successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }, { status: 201 });
  } catch (error) {
    console.error(error);

    // Handle duplicate email error
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "This email is already registered. Please use a different email." }, { status: 400 });
    }

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

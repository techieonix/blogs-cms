// import { User } from "@/src/models/user";
// import { NextResponse, NextRequest } from "next/server";
// import { connectDb } from "../../configs/database";

// connectDb();

// export interface GetRequest extends NextRequest {}

// export function GET(request: GetRequest): NextResponse {
//     const users = [
//         {
//             id: 1,
//             name: "John Doe",
//             email: "john@gmail.com",
//         },
//         {
//             id: 2,
//             name: "Jane Smith",
//             email: "jane@gmail.com",
//         }
//     ]
//     return NextResponse.json(users, { status: 200 });
// }

// //create user
// export async function POST(request: Request) {
//   await connectDb();
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

//   const user = new User({ name, email, password, role });

//   try {
//     await user.save();
//     return NextResponse.json(user, { status: 201 });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     return NextResponse.json({ error: errorMessage }, { status: 400 });
//   }
// }

// // Update user
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

// // Delete user
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

// // Get user(s)
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
// }

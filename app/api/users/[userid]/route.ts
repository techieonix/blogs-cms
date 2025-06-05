import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/src/app/configs/database";
import { Blog } from "@/src/models/blog";

export async function GET(request: NextRequest, {params}: {params: {userid: string}}) {
  await connectDb();
  const userid = params.userid;

  if (!userid) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const userBlogs = await Blog.find({ authorId: userid });
  if (userBlogs.length === 0) {
    return NextResponse.json(
      { message: "No blogs found for this user" },
      { status: 404 }
    );
  }
  return NextResponse.json(userBlogs, { status: 200 });
}

// export async function DELETE(
//     request: Request,
//     { params }: { params: { userid: string } }
// ): Promise<NextResponse> {
//     await connectDb();
//     const { userid } = params;
//     return NextResponse.json({ message: `User ${userid} deleted` }, { status: 200 });
// }

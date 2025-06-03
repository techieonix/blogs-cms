// import { NextResponse } from "next/server";
// import { connectDb } from "@/src/app/configs/database";

// export async function DELETE(
//     request: Request,
//     { params }: { params: { userid: string } }
// ): Promise<NextResponse> {
//     await connectDb();
//     const { userid } = params;
//     return NextResponse.json({ message: `User ${userid} deleted` }, { status: 200 });
// }
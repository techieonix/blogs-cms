import { NextResponse } from "next/server";

export function DELETE(
    request: Request,
    { params }: { params: { userid: string } }
): NextResponse {
    const { userid } = params;
    return NextResponse.json({ message: `User ${userid} deleted` }, { status: 200 });
}
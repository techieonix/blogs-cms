import { NextResponse } from "next/server";

export function GET(request: Request, { params }: { params: { userid: string; blogid: string }}) {
    const {userid, blogid} = params;
    return NextResponse.json(params, { status: 200 });
}
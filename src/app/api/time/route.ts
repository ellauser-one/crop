import { NextResponse } from "next/server";

export function GET() {
    console.log('Get /api/time:');
    return NextResponse.json({
        time: new Date().toLocaleTimeString(),
    });
}
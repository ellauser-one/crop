import { NextRequest, NextResponse } from "next/server";
import db from "@/src/app/db";

async function resolveParams(context: any) {
    if (!context) return undefined;
    if (context.params && typeof context.params.then === 'function') return await context.params;
    return context.params ?? context;
}

export async function GET(request: NextRequest, context: any) {
    const params = await resolveParams(context);
    const data = db.data.posts.find(item => item.id === params?.id);
    if (!data) return NextResponse.json({ code: 1, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ code: 0, message: "获取成功", data });
}

export async function PATCH(request: NextRequest, context: any) {
    const params = await resolveParams(context);
    const payload = await request.json();
    let idx = -1;
    await db.update(({ posts }) => {
        idx = posts.findIndex(item => item.id === params?.id);
        if (idx !== -1) posts[idx] = { ...posts[idx], ...payload };
    });
    if (idx === -1) return NextResponse.json({ code: 1, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ code: 0, message: "更新成功", data: db.data.posts[idx] });
}

export async function DELETE(request: NextRequest, context: any) {
    const params = await resolveParams(context);
    let removed = null;
    await db.update(({ posts }) => {
        const idx = posts.findIndex(item => item.id === params?.id);
        if (idx !== -1) removed = posts.splice(idx, 1)[0];
    });
    if (!removed) return NextResponse.json({ code: 1, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ code: 0, message: "删除成功" });
}

import { NextRequest, NextResponse } from "next/server";
import db from "@/src/app/db";

async function resolveParams(context: any) {
    if (!context) return undefined;
    if (context.params && typeof context.params.then === 'function') return await context.params;
    return context.params ?? context;
}


export async function GET(request: NextRequest) {
    const searchParams = new URL(request.url).searchParams;
    const pageNum = Number(searchParams.get('pageNum')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 2;
    const query = searchParams.get('query') || '';

    const data = db.data.posts;

    let filteredData = query ? data.filter(item => {
        const { id, ...rest } = item;
        return Object.values(rest).some(value => String(value).toLowerCase().includes(query.toLowerCase()))
    }) : data;

    const total = filteredData.length;
    const start = (pageNum - 1) * pageSize;
    const end = Math.min(start + pageSize, total);
    filteredData = start >= total ? [] : filteredData.slice(start, end);

    return NextResponse.json({
        code: 0,
        message: "列表获取成功",
        data: {
            list: filteredData,
            total,
        }
    });
}

export async function POST(request: NextRequest) {
    const data = await request.json();
    await db.update(({ posts }) => posts.unshift({
        id: Math.random().toString(36).slice(-8),
        ...data,
    }));
    return NextResponse.json({
        code: 0,
        message: "添加成功",
        data
    });
}



// // 本地假数据
// const dbMock = [
//     { id: 1, name: 'JohnBrown', address: 'New York No. 1 Lake Park' },
//     { id: 2, name: 'JimGreen', address: 'London No. 1 Lake Park' },
//     { id: 3, name: 'JoeBlack', address: 'Sidney No. 1 Lake Park' },
// ];

// export async function handler(req: NextRequest, res: NextResponse) {
//     // 支持分页 /api/users?page=1&pageSize=10
//     const searchParams = new URL(req.url).searchParams;
//     const pageNum = Number(searchParams.get('pageNum')) || 1;
//     const pageSize = Number(searchParams.get('pageSize')) || 2;

//     const start = (pageNum - 1) * pageSize;
//     const list = dbMock.slice(start, start + pageSize);
//     const total = list.length;
//     return NextResponse.json({
//         code: 0,
//         message: "列表获取成功",
//         data: {
//             list: list,
//             total,
//         }
//     });
// }
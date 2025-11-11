import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // 经过 middleware 的资源
    console.log('middleware', request.nextUrl.pathname);
}

export const config = {
    matcher: ['/about'],
};
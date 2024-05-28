import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest)
{
    if (request.nextUrl.pathname == "/" || request.nextUrl.pathname.includes("/home")) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
}
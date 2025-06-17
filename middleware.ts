import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const signInPath = '/login';
export function middleware(request: NextRequest) {

    const {  origin, basePath } = request.nextUrl

    console.log(request.url)
    if (request.url.includes("/logout")) {
        request.cookies.delete('_token')
        const response = NextResponse.redirect(new URL(`${basePath}${signInPath}`, origin));
        response.cookies.delete("_token");
        console.log("logout....")
        return response;

    }
    const userToken = request.cookies.get('_token')?.value;
    // console.log(userToken)

    if (request.nextUrl.pathname.includes("/login")) {
        console.log("login....")
        return;
    }
    else if (!userToken) {
        console.log("No token...");
        return NextResponse.redirect(new URL(`${basePath}${signInPath}`, origin))
    }
    else if (userToken != 'undefined' && isTokenExpired(userToken)) {
        console.log("Token Expired!");
        const response= NextResponse.redirect(new URL(`${basePath}${signInPath}`, origin))
        clearToken(request,response);
        return response;
    }
    else if (request.nextUrl.pathname == "/" || request.nextUrl.pathname.includes("/home")) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
}

function isTokenExpired(token: any) {
    console.log(`token:${token}`);
    const decoded: any = JSON.parse(Buffer.from(token?.split(".")?.at(1), 'base64').toString('utf8'));
    console.log(decoded.exp);
    if ((decoded.exp * 1000) < Date.now()) {
        return true;
    }
    return false;
}

function clearToken(request: NextRequest, response: NextResponse) {
    request.cookies.delete('_token')
    response.cookies.delete('_token')
}

export const config = {
    matcher: ['/', '/login', '/logout', '/dashboard', '/author/:path*', '/author', '/orders/:path*', '/book/:path*', '/member/:path*'],
}
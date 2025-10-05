import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const user = await getToken({ req, secret: process.env.AUTH_SECRET })

    // Пути без проверки
    const publicPaths = [
        "/_next",
        "/favicon.ico",
        "/api/auth",
        "/auth/reset-password",
        "/auth/login",
        "/auth/register",
        "/terms",
        "/api/webhooks/stripe",
    ];

    if (publicPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    if (pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
        if (!(process.env.ADMIN_EMAILS?.split(',') ?? []).includes(user.email)) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next()
    }

    const authPaths = ["/auth/login", "/auth/register", "/auth/check-email"];

    // Забираем токен из cookie (NextAuth хранит в `next-auth.session-token`)
    let token = "";
    const authSessionTokens = [
        "__Secure-next-auth.session-token",
        "next-auth.session-token",
    ];

    for (const [key, value] of req.cookies) {
        if (authSessionTokens.includes(key)) {
            token = value.value;
        }
    }

    if (!user) {
        if (!authPaths.includes(pathname)) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
        return NextResponse.next();
    }

    if (authPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();

    // try {
    //   // Проверяем JWT
    //   await jwtVerify(token, new TextEncoder().encode(process.env.NEXTAUTH_SECRET!));
    //
    //   // Авторизованный не должен попадать на login/register

    //
    //   return NextResponse.next();
    // } catch (e) {
    //   console.error("JWT invalid", e);
    //   if (!authPaths.includes(pathname)) {
    //     return NextResponse.redirect(new URL("/auth/login", req.url));
    //   }
    //   return NextResponse.next();
    // }
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|api/auth).*)", '/'],
};

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const user = await getToken({ req, secret: process.env.AUTH_SECRET });

    const publicPaths = [
        "/_next",
        "/favicon.ico",
        "/images",
        "/api/auth",
        "/auth/reset-password",
        "/legal",
        "/home",
        "/api/webhooks/stripe",
        '/manifest.json',
        '/logo'
    ];

    const authPaths = ["/auth/login", "/auth/register", "/auth/check-email"];

    // Разрешаем публичные пути
    if (publicPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Доступ к /admin только для админов
    if (pathname.startsWith("/admin")) {
        if (!user) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
        if (!(process.env.ADMIN_EMAILS?.split(",") ?? []).includes(user.email)) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    // Если пользователь не авторизован
    if (!user) {
        // Разрешаем /home и auth пути
        if (
            pathname.startsWith("/home") ||
            authPaths.some((path) => pathname.startsWith(path)) ||
            publicPaths.some((path) => pathname.startsWith(path))
        ) {
            return NextResponse.next();
        }

        // Всё остальное ведёт на /home
        return NextResponse.redirect(new URL("/home", req.url));
    }

    // Если пользователь авторизован — не пускать его на /auth/* и /home
    if (
        authPaths.some((path) => pathname.startsWith(path)) ||
        pathname.startsWith("/home")
    ) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Всё остальное разрешено
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|api/auth).*)", "/"],
};

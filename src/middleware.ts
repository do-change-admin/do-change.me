import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Пути без проверки
  const publicPaths = [
    "/_next",
    "/favicon.ico",
    "/api/auth",
    "/auth/reset-password",
  ];

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const authPaths = ["/auth/login", "/auth/register"];

  // Забираем токен из cookie (NextAuth хранит в `next-auth.session-token`)
  let token = '';

  for (const [key, value] of req.cookies) {
    if (key === "next-auth.session-token") {
      token = value.value;
    }
  }

  if (!token) {
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
  matcher: ["/((?!_next|favicon.ico|api/auth).*)"],
};

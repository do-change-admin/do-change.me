// src/auth.ts или app/auth.ts
import NextAuth from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/authOptions";

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
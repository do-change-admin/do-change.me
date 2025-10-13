import { compare } from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { businessError } from "@/lib/errors";
import { prismaClient } from "@/infrastructure/prisma/client";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password)
                    throw new Error(
                        JSON.stringify(
                            businessError("Email and password are required")
                        )
                    );

                const user = await prismaClient.user.findUnique({
                    where: { email: credentials.email.toLowerCase() },
                    include: { accounts: true },
                });

                if (!user || !user.password)
                    throw new Error(
                        JSON.stringify(
                            businessError("Email or password is incorrect")
                        )
                    );

                // if (!user.emailVerifiedAt) {
                //     throw new Error(
                //         JSON.stringify(
                //             businessError(
                //                 "Email not verified",
                //                 "EMAIL_NOT_VERIFIED"
                //             )
                //         )
                //     );
                // }

                const valid = await compare(
                    credentials.password,
                    user.password
                );

                if (!valid)
                    throw new Error(
                        JSON.stringify(
                            businessError("Email or password is incorrect")
                        )
                    );

                return { id: user.id, email: user.email };
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session: { strategy: "jwt" },

    callbacks: {
        async signIn({ user, account }) {
            let dbUser = await prismaClient.user.findUnique({
                where: { email: user.email?.toLowerCase()! },
                include: { accounts: true },
            });

            if (!dbUser) {
                const [firstName, ...rest] = user.name?.split(" ") ?? [];
                const lastName = rest.join(" ");

                dbUser = await prismaClient.user.create({
                    data: {
                        email: user.email!,
                        emailVerifiedAt: new Date(),
                        firstName,
                        lastName,
                        image: user.image || undefined,
                    },
                    include: { accounts: true },
                });
            }

            const existingAccount = await prismaClient.account.findUnique({
                where: {
                    provider_providerAccountId: {
                        provider: account!.provider,
                        providerAccountId: account!.providerAccountId!,
                    },
                },
            });

            if (!existingAccount) {
                await prismaClient.account.create({
                    data: {
                        userId: dbUser.id,
                        provider: account!.provider,
                        providerAccountId: account!.providerAccountId!,
                    },
                });
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email!;
            }
            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id;
            session.user.email = token.email;
            return session;
        },
    },

    pages: {
        signIn: "/auth/login",
    },
};

import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { DIContainer } from '@/backend/di-containers';
import type { ServiceErrorModel } from '@/backend/utils/errors.utils';
import { businessError } from '@/lib-deprecated/errors';
import { CommonErrorCodes } from '@/utils/error-codes';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error(JSON.stringify(businessError('Email and password are required')));
                }

                const userIdentityService = DIContainer().UserIdentityService();
                const logger = DIContainer().Logger();

                try {
                    return await userIdentityService.authorize(credentials);
                } catch (err: any) {
                    const _err = err as ServiceErrorModel;

                    logger.error(_err);

                    if (_err.code === CommonErrorCodes.INVALID_CREDENTIALS) {
                        throw new Error(JSON.stringify(businessError('Email and password are required')));
                    }

                    if (_err.code === CommonErrorCodes.EMAIL_NOT_VERIFIED) {
                        throw new Error(JSON.stringify(businessError('Email not verified', _err.code)));
                    }

                    throw new Error(JSON.stringify(err));
                }
            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],

    session: { strategy: 'jwt' },

    callbacks: {
        async signIn({ user, account }) {
            if (!user.email || !account) return false;

            const userIdentityService = DIContainer().UserIdentityService();

            await userIdentityService.oAuthSignIn({
                email: user.email,
                name: user.name ?? undefined,
                image: user.image ?? undefined,
                provider: account.provider,
                providerAccountId: account.providerAccountId
            });

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

        // ✅ Новый callback: куда перенаправлять после логина
        async redirect({ url, baseUrl }) {
            // После авторизации или регистрации → на главную (/)
            if (url.startsWith('/auth/login') || url.startsWith('/auth/register')) {
                return baseUrl;
            }

            // Если задан внутренний путь — вернуть туда
            if (url.startsWith('/')) return `${baseUrl}${url}`;

            // Иначе — на корень
            return baseUrl;
        }
    },

    pages: {
        signIn: '/auth/login'
    }
};

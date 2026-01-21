import { redirect } from 'next/navigation';
import { type NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { DIContainer } from '@/backend/di-containers';
import { DIStores } from '@/backend/di-containers/tokens.di-container';
import { verificationEmail } from '@/backend/infrastructure/email/templates/verification-email';
import { prismaClient } from '@/backend/infrastructure/prisma/client';
import type { UserStore } from '@/backend/stores/user';
import { User } from '@/entities/user';
import { serverError, validationError } from '@/lib-deprecated/errors';
import { EMailAddress } from '@/utils/entities/email-address';
import { StringHash } from '@/utils/entities/string-hash';
import { Token } from '@/utils/entities/token';
import { EmailMessage } from '@/value-objects/email-message.value-object';
import { VerifyEmail } from './models';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { success, data, error } = VerifyEmail.safeParse(body);

    if (!success) {
        return NextResponse.json(validationError(z.treeifyError(error)), {
            status: 400
        });
    }

    try {
        const { email: rawEmail } = data;

        const email = EMailAddress.create(rawEmail);

        const userStore = DIContainer()._context.get<UserStore>(DIStores.users);

        const userModel = await userStore.details({ email: email.model });

        if (!userModel || userModel.emailVerifiedAt) {
            return NextResponse.json({ message: 'Verification email sent' });
        }

        await prismaClient.emailVerificationToken.deleteMany({
            where: { userId: userModel.id }
        });

        const token = Token.withTimeToLive(Number(process.env.TOKEN_TTL_MS));

        await prismaClient.emailVerificationToken.create({
            data: {
                expiresAt: token.model.expiresAt,
                tokenHash: token.model.hash,
                userId: userModel.id
            }
        });

        const mailerProvider = DIContainer().MailerProvider();
        const emailMessage = EmailMessage.create(verificationEmail(User.create(userModel), token.model.raw));
        mailerProvider.send(emailMessage);

        return NextResponse.json({ message: 'Verification email sent' });
    } catch {
        return NextResponse.json(serverError(), { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const rawToken = searchParams.get('token');

    if (!rawToken) {
        return redirect('/auth/login?error=INVALID_TOKEN');
    }

    const tokenHash = StringHash.create(rawToken).hashValue;

    const tokenEntity = await prismaClient.emailVerificationToken.findUnique({
        where: { tokenHash }
    });

    if (!tokenEntity) {
        return redirect('/auth/login?error=INVALID_TOKEN');
    }

    const token = Token.rehydrate({ expiresAt: tokenEntity.expiresAt, hash: tokenHash, raw: rawToken });

    if (token.isExpired) {
        return redirect('/auth/login?error=TOKEN_EXPIRED');
    }

    await prismaClient.user.update({
        where: { id: tokenEntity.userId },
        data: { emailVerifiedAt: new Date() }
    });
    await prismaClient.emailVerificationToken.delete({
        where: { id: tokenEntity.id }
    });

    return redirect('/auth/login?verified=1');
}

import { type NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { DIContainer } from '@/backend/di-containers';
import { passwordReset } from '@/backend/infrastructure/email/templates/password-reset';
import { prismaClient } from '@/backend/infrastructure/prisma/client';
import { serverError, validationError } from '@/lib-deprecated/errors';
import { Token } from '@/utils/entities/token';
import { EmailMessage } from '@/value-objects/email-message.value-object';
import { RequestPassword } from './models';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { success, data, error } = RequestPassword.safeParse(body);

    if (!success) {
        return NextResponse.json(validationError(z.treeifyError(error)), {
            status: 400
        });
    }

    try {
        const { email } = data;

        const user = await prismaClient.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ message: "If that email exists, we'll send instructions." }, { status: 200 });
        }

        await prismaClient.passwordResetToken.deleteMany({
            where: { userId: user.id }
        });

        const token = Token.withTimeToLive(Number(process.env.TOKEN_TTL_MS));

        await prismaClient.passwordResetToken.create({
            data: {
                tokenHash: token.model.hash,
                userId: user.id,
                expiresAt: token.model.expiresAt
            }
        });

        const emailService = DIContainer().MailerProvider();
        const resetEmail = EmailMessage.create(passwordReset(user, token.model.raw));
        emailService.send(resetEmail);

        return NextResponse.json({ message: "If that email exists, we'll send instructions." }, { status: 200 });
    } catch (_err) {
        return NextResponse.json(serverError(), { status: 500 });
    }
}

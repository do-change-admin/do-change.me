import { type NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { DIContainer } from '@/backend/di-containers';
import { verificationEmail } from '@/backend/infrastructure/email/templates/verification-email';
import { prismaClient } from '@/backend/infrastructure/prisma/client';
import { businessError, serverError, validationError } from '@/lib-deprecated/errors';
import { generatePasswordHash } from '@/lib-deprecated/password';
import { EmailMessage } from '@/value-objects/email-message.value-object';
import { Token } from '@/value-objects/token.vo';
import { RegistreUser } from './models';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { success, data, error } = RegistreUser.safeParse(body);

    if (!success) {
        return NextResponse.json(validationError(z.treeifyError(error)), {
            status: 400
        });
    }

    try {
        const { email, firstName, lastName, password } = data;

        const existing = await prismaClient.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existing) {
            return NextResponse.json(businessError('User already exists', 'USER_ALREADY_EXISTS'), {
                status: 400
            });
        }

        const hashedPassword = await generatePasswordHash(password);

        const user = await prismaClient.user.create({
            data: {
                email: email.toLocaleLowerCase(),
                password: hashedPassword,
                firstName,
                lastName
            }
        });

        const token = Token.withTimeToLive(Number(process.env.TOKEN_TTL_MS));

        await prismaClient.emailVerificationToken.create({
            data: {
                expiresAt: token.expiresAt,
                tokenHash: token.hash,
                userId: user.id
            }
        });

        const mailerProvider = DIContainer().MailerProvider();
        const emailMessage = EmailMessage.create(verificationEmail(user, token.raw));
        await mailerProvider.send(emailMessage);

        return NextResponse.json({ message: 'User created' }, { status: 201 });
    } catch (err: any) {
        console.log(err, 'REGISTRATION ERROR');
        return NextResponse.json(serverError(), { status: 500 });
    }
}

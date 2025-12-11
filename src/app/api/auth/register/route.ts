import { type NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { prismaClient } from '@/backend/infrastructure/prisma/client';
import { businessError, serverError, validationError } from '@/lib-deprecated/errors';
import { generatePasswordHash } from '@/lib-deprecated/password';
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

        await prismaClient.user.create({
            data: {
                email: email.toLocaleLowerCase(),
                password: hashedPassword,
                firstName,
                lastName,
                emailVerifiedAt: new Date()
            }
        });

        // const token = Token.withTimeToLive(Number(process.env.TOKEN_TTL_MS));

        // await prismaClient.emailVerificationToken.create({
        //     data: {
        //         expiresAt: token.expiresAt,
        //         tokenHash: token.hash,
        //         userId: user.id
        //     }
        // });

        // after(() => {
        //     const emailService = DIContainer()._EmailService();
        //     const email = verificationEmail(user, token.raw);
        //     emailService.sendEmail(email);
        // });

        return NextResponse.json({ message: 'User created' }, { status: 201 });
    } catch (err: any) {
        console.log(err, 'REGISTRATION ERROR');
        return NextResponse.json(serverError(), { status: 500 });
    }
}

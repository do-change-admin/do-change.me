import { type NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { prismaClient } from '@/backend/infrastructure/prisma/client';
import { businessError, serverError, validationError } from '@/lib-deprecated/errors';
import { generatePasswordHash } from '@/lib-deprecated/password';
import { VO } from '@/value-objects';
import { Token } from '@/value-objects/token.vo';
import { ResetPassword } from './models';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { success, data, error } = ResetPassword.safeParse(body);

    if (!success) {
        return NextResponse.json(validationError(z.treeifyError(error)), {
            status: 400
        });
    }

    try {
        const { password, token: rawToken } = data;
        const tokenHash = new VO.StringHash.Instance(rawToken).value();

        const record = await prismaClient.passwordResetToken.findUnique({
            where: { tokenHash }
        });

        if (!record) {
            return NextResponse.json(businessError('Token is invalid', 'INVALID_TOKEN'), { status: 400 });
        }

        const token = Token.rehydrate(rawToken, record.tokenHash, record.expiresAt);

        if (token.isExpired()) {
            return NextResponse.json(businessError('Token is expired', 'TOKEN_EXPIRED'), { status: 400 });
        }

        const user = await prismaClient.user.findUnique({
            where: { id: record.userId }
        });

        if (!user) {
            return NextResponse.json(businessError('User not found', 'USER_NOT_FOUND'), {
                status: 400
            });
        }

        const hash = await generatePasswordHash(password);
        await prismaClient.user.update({
            where: { id: user.id },
            data: { password: hash }
        });

        await prismaClient.passwordResetToken.deleteMany({
            where: { userId: user.id }
        });

        return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
    } catch (_err) {
        return NextResponse.json(serverError(), { status: 500 });
    }
}

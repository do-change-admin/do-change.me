import { after, NextRequest, NextResponse } from "next/server";
import { RequestPassword } from "./models";
import z from "zod";
import { serverError, validationError } from "@/lib/errors";
import { passwordReset } from "@/infrastructure/email/templates/password-reset";
import { prismaClient } from "@/infrastructure/prisma/client";
import { Token } from "@/value-objects/token.vo";
import { DIContainer } from "@/di-containers";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { success, data, error } = RequestPassword.safeParse(body);

    if (!success) {
        return NextResponse.json(validationError(z.treeifyError(error)), {
            status: 400,
        });
    }

    try {
        const { email } = data;

        const user = await prismaClient.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "If that email exists, we'll send instructions." },
                { status: 200 }
            );
        }

        await prismaClient.passwordResetToken.deleteMany({
            where: { userId: user.id },
        });

        const token = Token.withTimeToLive(Number(process.env.TOKEN_TTL_MS));

        await prismaClient.passwordResetToken.create({
            data: {
                tokenHash: token.hash,
                userId: user.id,
                expiresAt: token.expiresAt,
            },
        });

        after(() => {
            const emailService = DIContainer()._EmailService();
            const email = passwordReset(user, token.raw);
            emailService.sendEmail(email);
        });

        return NextResponse.json(
            { message: "If that email exists, we'll send instructions." },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(serverError(), { status: 500 });
    }
}

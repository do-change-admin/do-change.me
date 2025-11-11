import { redirect } from "next/navigation";
import { after, NextRequest, NextResponse } from "next/server";
import z from "zod";
import { VerifyEmail } from "./models";
import { serverError, validationError } from "@/lib-deprecated/errors";
import { verificationEmail } from "@/backend/infrastructure/email/templates/verification-email";
import { prismaClient } from "@/backend/infrastructure/prisma/client";
import { Token } from "@/value-objects/token.vo";
import { VO } from "@/value-objects";
import { DIContainer } from "@/backend/di-containers";
import { EmailMessage } from "@/value-objects/email-message.value-object";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { success, data, error } = VerifyEmail.safeParse(body);

    if (!success) {
        return NextResponse.json(validationError(z.treeifyError(error)), {
            status: 400,
        });
    }

    try {
        const { email } = data;

        const user = await prismaClient.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user || user.emailVerifiedAt) {
            return NextResponse.json({ message: "Verification email sent" });
        }

        await prismaClient.emailVerificationToken.deleteMany({
            where: { userId: user.id },
        });

        const token = Token.withTimeToLive(Number(process.env.TOKEN_TTL_MS));

        await prismaClient.emailVerificationToken.create({
            data: {
                expiresAt: token.expiresAt,
                tokenHash: token.hash,
                userId: user.id,
            },
        });

        const emailService = DIContainer().MailerService();
        const emailMessage = EmailMessage.create(
            verificationEmail(user, token.raw)
        );
        await emailService.send(emailMessage);

        return NextResponse.json({ message: "Verification email sent" });
    } catch (err) {
        return NextResponse.json(serverError(), { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const rawToken = searchParams.get("token");

    if (!rawToken) {
        return redirect("/auth/login?error=INVALID_TOKEN");
    }

    const tokenHash = new VO.StringHash.Instance(rawToken).value();

    const tokenEntity = await prismaClient.emailVerificationToken.findUnique({
        where: { tokenHash },
    });

    if (!tokenEntity) {
        return redirect("/auth/login?error=INVALID_TOKEN");
    }

    const token = Token.rehydrate(rawToken, tokenHash, tokenEntity.expiresAt);

    if (token.isExpired()) {
        return redirect("/auth/login?error=TOKEN_EXPIRED");
    }

    await prismaClient.user.update({
        where: { id: tokenEntity.userId },
        data: { emailVerifiedAt: new Date() },
    });
    await prismaClient.emailVerificationToken.delete({
        where: { id: tokenEntity.id },
    });

    return redirect("/auth/login?verified=1");
}

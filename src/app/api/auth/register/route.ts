import { after, NextRequest, NextResponse } from "next/server";
import { RegistreUser } from "./models";
import { generatePasswordHash } from "@/lib/password";
import { businessError, serverError, validationError } from "@/lib/errors";
import z from "zod";
import { verificationEmail } from "@/infrastructure/email/templates/verification-email";
import { prismaClient } from "@/infrastructure/prisma/client";
import { Token } from "@/value-objects/token.vo";
import { DIContainer } from "@/di-containers";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { success, data, error } = RegistreUser.safeParse(body);

    if (!success) {
        return NextResponse.json(validationError(z.treeifyError(error)), {
            status: 400,
        });
    }

    try {
        const { email, firstName, lastName, password } = data;

        const existing = await prismaClient.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existing) {
            return NextResponse.json(
                businessError("User already exists", "USER_ALREADY_EXISTS"),
                {
                    status: 400,
                }
            );
        }

        const hashedPassword = await generatePasswordHash(password);

        const user = await prismaClient.user.create({
            data: {
                email: email.toLocaleLowerCase(),
                password: hashedPassword,
                firstName,
                lastName,
            },
        });

        const token = Token.withTimeToLive(Number(process.env.TOKEN_TTL_MS));

        await prismaClient.emailVerificationToken.create({
            data: {
                expiresAt: token.expiresAt,
                tokenHash: token.hash,
                userId: user.id,
            },
        });

        after(() => {
            const emailService = DIContainer()._EmailService();
            const email = verificationEmail(user, token.raw);
            emailService.sendEmail(email);
        });

        return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (err) {
        return NextResponse.json(serverError(), { status: 500 });
    }
}

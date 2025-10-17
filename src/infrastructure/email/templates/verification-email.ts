import { VO } from "@/value-objects";
import type { User } from "@prisma/client";

export function verificationEmail(user: User, tokenRow: string) {
    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/email/verify?token=${tokenRow}`;

    return {
        // TODO: временный email для разработки
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Confirm your email",
        content: `
              <p>Hello,</p>
              <p>Please confirm your email by clicking on the link below:</p>
              <a href="${verifyUrl}">Confirm email</a>
              <p>If you didn't request this, just ignore this email.</p>
            `,
    } satisfies VO.EmailMessage.Model;
}

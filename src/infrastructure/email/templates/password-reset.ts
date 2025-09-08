import { User } from "@prisma/client";

export function passwordReset(user: User, tokenRaw: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${tokenRaw}`;

    return {
        // TODO: временный email для разработки
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Reset your password",
        html: `
          <p>Hello,</p>
          <p>Click the link below to reset your password (valid for 1 hour):</p>
          <p><a href="${resetUrl}">Reset password</a></p>
          <p>If you didn't request this, just ignore this email.</p>
        `,
    };
}

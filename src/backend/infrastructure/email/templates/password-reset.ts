import type { User } from '@prisma/client';
import type { EmailMessageSchema } from '@/value-objects/email-message.value-object';

export function passwordReset(user: User, tokenRaw: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${tokenRaw}`;

    return {
        from: 'info@do-change.com',
        to: user.email,
        subject: 'Reset your password',
        content: `
          <p>Hello,</p>
          <p>Click the link below to reset your password (valid for 1 hour):</p>
          <p><a href="${resetUrl}">Reset password</a></p>
          <p>If you didn't request this, just ignore this email.</p>
        `
    } satisfies EmailMessageSchema;
}

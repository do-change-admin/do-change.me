import type { User } from '@/entities/user';
import type { EmailMessageSchema } from '@/value-objects/email-message.value-object';

export function verificationEmail(user: User, tokenRow: string) {
    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/email/verify?token=${tokenRow}`;

    return {
        from: 'info@do-change.com',
        to: user.model.email,
        subject: 'Confirm your email',
        content: `
              <p>Hello,</p>
              <p>Please confirm your email by clicking on the link below:</p>
              <a href="${verifyUrl}">Confirm email</a>
              <p>If you didn't request this, just ignore this email.</p>
            `
    } satisfies EmailMessageSchema;
}

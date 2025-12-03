import z from 'zod';
import { MIN_PASSWORD_LENGTH } from '@/lib-deprecated/password';

export const ResetPassword = z.object({
    token: z.string().nonempty(),
    password: z.string().min(MIN_PASSWORD_LENGTH)
});

export type ResetPasswordSchema = z.infer<typeof ResetPassword>;

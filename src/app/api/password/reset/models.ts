import { MIN_PASSWORD_LENGTH } from "@/lib-deprecated/password";
import z from "zod";

export const ResetPassword = z.object({
    token: z.email(),
    password: z.string().min(MIN_PASSWORD_LENGTH),
});

export type ResetPasswordSchema = z.infer<typeof ResetPassword>;

import z from "zod";

export const VerifyEmail = z.object({
    email: z.email(),
});

export type VerifyEmailSchema = z.infer<typeof VerifyEmail>;

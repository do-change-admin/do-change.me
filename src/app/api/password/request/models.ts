import z from "zod";

export const RequestPassword = z.object({
    email: z.email(),
});

export type RequestPasswordSchema = z.infer<typeof RequestPassword>;

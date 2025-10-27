import { MIN_PASSWORD_LENGTH } from "@/lib-deprecated/password";
import z from "zod";

export const RegistreUser = z.object({
    email: z.email(),
    password: z.string().min(MIN_PASSWORD_LENGTH),
    firstName: z.string(),
    lastName: z.string(),
});

export type RegistreUserSchema = z.infer<typeof RegistreUser>;

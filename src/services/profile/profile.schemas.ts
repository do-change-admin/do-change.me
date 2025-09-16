import z from "zod"

export const profileSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    email: z.string(),
    bio: z.string(),
})

export const updateProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    bio: z.string().optional(),
})
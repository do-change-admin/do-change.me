import z from "zod"

export const subscriptionSchema = z.object({
    planName: z.string(),
    planSlug: z.string(),
    priceSlug: z.string(),
    status: z.string(),
    cancelAtPeriodEnd: z.boolean(),
    currentPeriodEnd: z.date(),
    amount: z.number(),
    currency: z.string(),
});


export const profileSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    email: z.string(),
    bio: z.string(),
    subscription: subscriptionSchema.nullable(),
})

export const updateProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    bio: z.string().optional(),
})


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
    address: z.string().nullable(),
    state: z.string().nullable(),
    zipCode: z.string().nullable(),
    photoLink: z.string().nullable(),
    birthDate: z.coerce.date().nullable(),
    auctionAccessNumber: z.string().nullable(),
    auctionAccessQRLink: z.string().nullable(),
    subscription: subscriptionSchema.nullable(),
})

export const updateProfileSchema = z.object({
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
    phone: z.string().nonempty(),
    bio: z.string().nonempty(),
    birthDate: z.coerce.date(),
    address: z.string().nullable(),
    state: z.string().nullable(),
    zipCode: z.string().nullable(),
})


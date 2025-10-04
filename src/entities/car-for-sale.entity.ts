import z from "zod";

export const carSaleStatusSchema = z.enum([
    'review',
    'published',
    'sold'
])

export const carForSaleUserDetailSchema = z.object({
    id: z.string().nonempty(),
    photoLink: z.url(),
    licencePlate: z.string(),
    status: carSaleStatusSchema,
    mileage: z.number()
})

export const carForSaleUserListSchema = carForSaleUserDetailSchema.pick({
    id: true,
    licencePlate: true,
    status: true
})

export const carForSaleAdminDetailSchema = carForSaleUserDetailSchema.extend({
    userId: z.string().nonempty(),
    userMail: z.email(),
})

export const carForSaleAdminListSchema = carForSaleAdminDetailSchema.pick({
    id: true,
    licencePlate: true,
    status: true,
    userMail: true
})

export type CarSaleStatus = z.infer<typeof carSaleStatusSchema>
export type CarForSaleUserDetailModel = z.infer<typeof carForSaleUserDetailSchema>
export type CarForSaleUserListModel = z.infer<typeof carForSaleUserListSchema>
export type CarForSaleAdminDetailModel = z.infer<typeof carForSaleAdminDetailSchema>
export type CarForSaleAdminListModel = z.infer<typeof carForSaleAdminListSchema>
import { VinSchema } from "@/schemas";
import z from "zod";

export const carSaleStatusSchema = z.enum([
    'draft',
    'pending publisher',
    'active',
    'pending sales',
    'sold'
])

export const carForSaleUserDetailSchema = z.object({
    id: z.string().nonempty(),
    photoLinks: z.array(z.url()),
    vin: VinSchema,
    status: carSaleStatusSchema,
    mileage: z.number(),
    price: z.number(),
    make: z.string().nonempty(),
    year: z.number(),
    model: z.string().nonempty(),
    marketplaceLinks: z.array(z.url())
})

export const carForSaleUserListSchema = carForSaleUserDetailSchema

export const carForSaleUserDraftSchema = carForSaleUserDetailSchema.partial({
    make: true,
    marketplaceLinks: true,
    mileage: true,
    model: true,
    price: true,
    vin: true,
    year: true
}).omit({
    status: true,
    photoLinks: true
}).extend({
    status: z.enum(['draft']),
    currentPhotos: z.array(
        z.object({
            id: z.string().nonempty(),
            url: z.url()
        })
    ).optional()
})

export const carForSaleAdminDetailSchema = carForSaleUserDetailSchema.extend({
    userId: z.string().nonempty(),
    userMail: z.email(),
})

export const carForSaleAdminListSchema = carForSaleAdminDetailSchema.pick({
    id: true,
    vin: true,
    status: true,
    userMail: true,
    userId: true,
    price: true,
    make: true,
    model: true
})

export type CarSaleStatus = z.infer<typeof carSaleStatusSchema>

export type CarForSaleUserDetailModel = z.infer<typeof carForSaleUserDetailSchema>
export type CarForSaleUserListModel = z.infer<typeof carForSaleUserListSchema>
export type CarForSaleUserDraftModel = z.infer<typeof carForSaleUserDraftSchema>

export type CarForSaleAdminDetailModel = z.infer<typeof carForSaleAdminDetailSchema>
export type CarForSaleAdminListModel = z.infer<typeof carForSaleAdminListSchema>
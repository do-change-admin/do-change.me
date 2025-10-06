import { carSaleStatusSchema } from "@/entities";
import { createCarForSalePayloadSchema } from "@/providers";
import { paginationSchema } from "@/value-objects";
import z from "zod";

export const findCarsForSaleUserServicePayloadSchema = paginationSchema.extend({
    status: carSaleStatusSchema.optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    vin: z.string().optional()
})

export const findDraftCarForSaleUserServicePayloadSchema = z.object({
    id: z.string().nonempty()
})

export const postCarForSaleUserServicePayloadSchema = createCarForSalePayloadSchema.omit({
    userId: true,
    photoIds: true
}).extend({
    draftId: z.string().optional()
})

export const createDraftCarForSaleUserServicePayloadSchema = postCarForSaleUserServicePayloadSchema.partial().omit({
    draftId: true
})
export const updateDraftCarForSaleUserServicePayloadSchema = createDraftCarForSaleUserServicePayloadSchema.extend({
    id: z.string().nonempty()
})

export type FindCarsForSaleUserServicePayload = z.infer<typeof findCarsForSaleUserServicePayloadSchema>
export type FindDraftCarForSaleUserServicePayload = z.infer<typeof findDraftCarForSaleUserServicePayloadSchema>
export type PostCarForSaleUserServicePayload = z.infer<typeof postCarForSaleUserServicePayloadSchema> & {
    photos: File[]
}
export type CreateDraftCarForSaleUserServicePayload = z.infer<typeof createDraftCarForSaleUserServicePayloadSchema> & {
    photos: File[] | undefined
}
export type UpdateDraftCarForSaleUserServicePayload = z.infer<typeof updateDraftCarForSaleUserServicePayloadSchema> & {
    photos: File[] | undefined
}
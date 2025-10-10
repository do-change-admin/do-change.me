import { carSaleStatusSchema } from "@/entities";
import { DataProviders } from "@/providers";
import { ValueObjects } from "@/value-objects";
import z from "zod";

export const findCarsPayloadSchema = ValueObjects.Pagination.schema.extend({
    status: carSaleStatusSchema.optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    vin: z.string().optional()
})

export const findDraftPayloadSchema = z.object({
    id: z.string().nonempty()
})

export const postCarPayloadSchema = DataProviders.CarsForSale.createPayloadSchema.omit({
    userId: true,
    photoIds: true,
    status: true
}).extend({
    draftId: z.string().optional()
})

export const createDraftPayloadSchema = postCarPayloadSchema.partial().omit({
    draftId: true
})
export const updateDraftPayloadSchema = createDraftPayloadSchema.extend({
    id: z.string().nonempty(),
    removedPhotoIds: z.array(z.string())
})

export type FindCarsPayload = z.infer<typeof findCarsPayloadSchema>
export type FindDraftPayload = z.infer<typeof findDraftPayloadSchema>
export type PostCarPayload = z.infer<typeof postCarPayloadSchema> & {
    photos: File[]
}
export type CreateDraftPayload = z.infer<typeof createDraftPayloadSchema> & {
    photos: File[] | undefined
}
export type UpdateDraftPayload = z.infer<typeof updateDraftPayloadSchema> & {
    newPhotos: File[] | undefined
}
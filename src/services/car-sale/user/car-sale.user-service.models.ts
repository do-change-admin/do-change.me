import { carSaleStatusSchema } from "@/entities";
import { createCarForSalePayloadSchema } from "@/providers";
import { paginationSchema } from "@/value-objects";
import z from "zod";

export const findCarsForSaleUserServicePayloadSchema = paginationSchema.extend({
    status: carSaleStatusSchema.optional(),
    make: carSaleStatusSchema.optional(),
    model: carSaleStatusSchema.optional()
})

export const findSpecificCarForSaleUserServicePayloadSchema = z.object({
    id: z.string().nonempty()
})

export const postCarForSaleUserServicePayloadSchema = createCarForSalePayloadSchema.omit({
    userId: true,
    photoIds: true
})


export type FindCarsForSaleUserServicePayload = z.infer<typeof findCarsForSaleUserServicePayloadSchema>
export type FindSpecificCarForSaleUserServicePayload = z.infer<typeof findSpecificCarForSaleUserServicePayloadSchema>
export type PostCarForSaleUserServicePayload = z.infer<typeof postCarForSaleUserServicePayloadSchema> & {
    photos: File[]
}
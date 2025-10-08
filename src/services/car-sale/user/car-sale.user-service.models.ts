import { carSaleStatusSchema } from "@/entities";
import { paginationSchema } from "@/value-objects";
import z from "zod";

export const findCarsForSaleUserServicePayloadSchema = paginationSchema.extend({
    status: carSaleStatusSchema.optional()
})

export const findSpecificCarForSaleUserServicePayloadSchema = z.object({
    id: z.string().nonempty()
})

export const postCarForSaleUserServicePayloadSchema = z.object({
    mileage: z.coerce.number(),
    licencePlate: z.string()
})


export type FindCarsForSaleUserServicePayload = z.infer<typeof findCarsForSaleUserServicePayloadSchema>
export type FindSpecificCarForSaleUserServicePayload = z.infer<typeof findSpecificCarForSaleUserServicePayloadSchema>
export type PostCarForSaleUserServicePayload = z.infer<typeof postCarForSaleUserServicePayloadSchema> & {
    photo: File
}
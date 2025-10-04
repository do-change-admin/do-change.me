import { carSaleStatusSchema } from "@/entities";
import { paginationSchema } from "@/value-objects";
import z from "zod";

export const findCarsForSaleSellsServicePayloadSchema = paginationSchema.extend({
    userId: z.string().optional(),
    status: carSaleStatusSchema.optional(),
})

export const findSpecificCarForSaleSellsServicePayloadSchema = z.object({
    id: z.string(),
    userId: z.string()
})

export const setCarSaleStatusSellsServicePayloadSchema = z.object({
    userId: z.string().nonempty(),
    carId: z.string().nonempty(),
    newStatus: carSaleStatusSchema
})

export type FindSpecificCarForSaleSellsServicePayload = z.infer<typeof findSpecificCarForSaleSellsServicePayloadSchema>
export type FindCarsForSaleSellsServicePayload = z.infer<typeof findCarsForSaleSellsServicePayloadSchema>
export type SetCarSaleStatusSellsServicePayload = z.infer<typeof setCarSaleStatusSellsServicePayloadSchema>
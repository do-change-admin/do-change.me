import { carSaleStatusSchema } from "@/entities";
import { paginationSchema } from "@/value-objects";
import z from "zod";

export const findCarsForSaleAdminServicePayloadSchema = paginationSchema.extend({
    userId: z.string().optional(),
    status: carSaleStatusSchema.optional(),
    model: z.string().optional(),
    make: z.string().optional()
})

export const findSpecificCarForSaleAdminServicePayloadSchema = z.object({
    id: z.string(),
    userId: z.string()
})

export const setCarSaleStatusAdminServicePayloadSchema = z.object({
    userId: z.string().nonempty(),
    carId: z.string().nonempty(),
    newStatus: carSaleStatusSchema
})

export type FindSpecificCarForSaleAdminServicePayload = z.infer<typeof findSpecificCarForSaleAdminServicePayloadSchema>
export type FindCarsForSaleAdminServicePayload = z.infer<typeof findCarsForSaleAdminServicePayloadSchema>
export type SetCarSaleStatusAdminServicePayload = z.infer<typeof setCarSaleStatusAdminServicePayloadSchema>
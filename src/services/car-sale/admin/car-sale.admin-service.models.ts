import { carSaleStatusSchema } from "@/entities";
import { VO } from "@/value-objects";
import z from "zod";

export const findListPayloadSchema = VO.Pagination.schema.extend({
    userId: z.string().optional(),
    status: carSaleStatusSchema.optional(),
    model: z.string().optional(),
    make: z.string().optional(),
    vin: z.string().optional()
})

export const findDetailsPayloadSchema = z.object({
    id: z.string(),
    userId: z.string()
})

export const updatePayloadSchema = z.object({
    userId: z.string().nonempty(),
    carId: z.string().nonempty(),
    payload: z.union([
        z.object({
            status: carSaleStatusSchema
        }),
        z.object({
            marketplaceLinks: z.array(z.url()).nonempty()
        })
    ])
})

export type FindDetailsPayload = z.infer<typeof findDetailsPayloadSchema>
export type FindListPayload = z.infer<typeof findListPayloadSchema>
export type UpdatePayload = z.infer<typeof updatePayloadSchema>
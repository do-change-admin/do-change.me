import z from "zod";
import { carSaleStatusSchema } from "@/entities";
import { CRUDActionsPayload, CRUDModels, CRUDSearchPayload, DataCRUDProvider } from "../shared";
import { VinSchema } from "@/schemas";

export const detailsSchema = z.object({
    userId: z.string().nonempty(),
    userMail: z.email(),
    id: z.string().nonempty(),
    vin: VinSchema,
    status: carSaleStatusSchema,
    mileage: z.number(),
    price: z.number(),
    make: z.string().nonempty(),
    year: z.number(),
    model: z.string().nonempty(),
    marketplaceLinks: z.array(z.url()),
    photoIds: z.array(z.string().nonempty())
})

export const listSchema = detailsSchema

export const findOnePayloadSchema = z.object({
    id: z.string().nonempty(),
    userId: z.string().nonempty()
})

export const findListPayloadSchema = z.object({
    userId: z.string().optional(),
    status: carSaleStatusSchema.optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    vin: z.string().optional()
})

export const createPayloadSchema = detailsSchema.omit({
    userMail: true,
    marketplaceLinks: true,
    id: true,
    status: true,
})

export const updatePayloadSchema = z.object({
    status: carSaleStatusSchema.optional(),
    marketplaceLinks: z.array(z.url()).optional(),
})

export type Details = z.infer<typeof detailsSchema>
export type ListModel = z.infer<typeof listSchema>

export type FindOnePayload = z.infer<typeof findOnePayloadSchema>
export type FindListPayload = z.infer<typeof findListPayloadSchema>

export type CreatePayload = z.infer<typeof createPayloadSchema>
export type UpdatePayload = z.infer<typeof updatePayloadSchema>

export type Interface = DataCRUDProvider<
    CRUDModels<ListModel, Details>,
    CRUDSearchPayload<FindListPayload, FindOnePayload>,
    CRUDActionsPayload<CreatePayload, UpdatePayload>
>
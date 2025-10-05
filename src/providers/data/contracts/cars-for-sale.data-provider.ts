import z from "zod";
import { carSaleStatusSchema } from "@/entities";
import { CRUDActionsPayload, CRUDModels, CRUDSearchPayload, DataCRUDProvider } from "../shared";
import { VinSchema } from "@/schemas";

export const carForSaleDetailDataLayerSchema = z.object({
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

export const carForSaleListDataLayerSchema = carForSaleDetailDataLayerSchema

export const findSpecificCarForSalePayloadSchema = z.object({
    id: z.string().nonempty(),
    userId: z.string().nonempty()
})

export const findCarsForSaleListPayloadSchema = z.object({
    userId: z.string().optional(),
    status: carSaleStatusSchema.optional(),
    make: z.string().optional(),
    model: z.string().optional()
})

export const createCarForSalePayloadSchema = carForSaleDetailDataLayerSchema.omit({
    userMail: true,
    marketplaceLinks: true,
    id: true,
    status: true,
})

export const updateCarForSalePayloadSchema = z.object({
    status: carSaleStatusSchema
})

export type CarForSaleDetailDataLayerModel = z.infer<typeof carForSaleDetailDataLayerSchema>
export type CarForSaleListDataLayerModel = z.infer<typeof carForSaleListDataLayerSchema>

export type FindSpecificCarForSalePayload = z.infer<typeof findSpecificCarForSalePayloadSchema>
export type FindCarsForSaleListPayload = z.infer<typeof findCarsForSaleListPayloadSchema>

export type CreateCarForSalePayload = z.infer<typeof createCarForSalePayloadSchema>
export type UpdateCarForSalePayload = z.infer<typeof updateCarForSalePayloadSchema>

export type CarsForSaleDataProvider = DataCRUDProvider<
    CRUDModels<CarForSaleListDataLayerModel, CarForSaleDetailDataLayerModel>,
    CRUDSearchPayload<FindCarsForSaleListPayload, FindSpecificCarForSalePayload>,
    CRUDActionsPayload<CreateCarForSalePayload, UpdateCarForSalePayload>
>
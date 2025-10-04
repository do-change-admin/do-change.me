import z from "zod";
import { carForSaleSellsDetailSchema, carForSaleSellsListSchema, carSaleStatusSchema } from "@/entities";
import { CRUDActionsPayload, CRUDModels, CRUDSearchPayload, DataCRUDProvider } from "../shared";

export const carForSaleDetailDataLayerSchema = carForSaleSellsDetailSchema.omit({
    photoLink: true
}).extend({
    photoId: z.string().nonempty()
})

export const carForSaleListDataLayerSchema = carForSaleSellsListSchema.extend({
    userId: z.string().nonempty()
})

export const findSpecificCarForSalePayloadSchema = z.object({
    id: z.string().nonempty(),
    userId: z.string().nonempty()
})

export const findCarsForSaleListPayloadSchema = z.object({
    userId: z.string().optional(),
    status: carSaleStatusSchema.optional()
})

export const createCarForSalePayloadSchema = carForSaleSellsDetailSchema.omit({
    userMail: true,
    id: true,
    status: true,
    photoLink: true
}).extend({
    photoId: z.string()
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
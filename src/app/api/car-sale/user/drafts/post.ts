import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { DIContainer } from "@/di-containers";
import { Services } from "@/services";
import z from "zod";

const schemas = {
    body: undefined,
    query: Services.CarSaleUser.createDraftPayloadSchema.omit({
        mileage: true,
        price: true,
        year: true
    }).extend({
        mileage: z.coerce.number().optional(),
        price: z.coerce.number().optional(),
        year: z.coerce.number().optional()
    }),
    response: undefined
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ activeUser, payload, req }) => {
        const service = DIContainer().CarSaleUserService(activeUser.id)
        const formData = await req.formData()
        let photos = undefined
        if (formData.has('photos')) {
            photos = formData.getAll('photos') as File[]
        }
        await service.createDraft({ ...payload, photos })
    }
})
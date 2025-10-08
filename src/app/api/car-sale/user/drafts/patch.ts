import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { DIContainer } from "@/di-containers";
import { Services } from "@/services";
import z from "zod";

const schemas = {
    body: undefined,
    query: Services.CarSaleUser.updateDraftPayloadSchema.omit({
        mileage: true,
        price: true,
        year: true
    }).extend({
        mileage: z.coerce.number(),
        price: z.coerce.number(),
        year: z.coerce.number()
    }),
    response: undefined
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ activeUser, payload, req }) => {
        const service = DIContainer().CarSaleUserService(activeUser.id)
        const formData = await req.formData()
        let newPhotos = undefined
        if (formData.has('photos')) {
            newPhotos = formData.getAll('photos') as File[]
        }

        await service.updateDraft({ ...payload, newPhotos })
    }
})
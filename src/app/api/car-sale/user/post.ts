import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { DIContainer } from "@/di-containers";
import { Services } from "@/services";
import z from "zod";

const schemas = {
    body: undefined,
    query: Services.CarSaleUser.postCarPayloadSchema.omit({
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
    handler: async ({ payload, activeUser, req }) => {
        const formData = await req.formData()
        const photos = formData.getAll('photos') as File[]
        const service = DIContainer().CarSaleUserService(activeUser.id)
        await service.post({
            ...payload,
            photos
        })
    }
})
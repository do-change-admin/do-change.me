import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { DIContainer } from "@/di-containers";
import { Services } from "@/services";
import z from "zod";

const schemas = {
    body: undefined,
    query: Services.CarSaleUser.updateDraftPayloadSchema.omit({
        mileage: true,
        price: true,
        year: true,
        removedPhotoIds: true
    }).extend({
        mileage: z.coerce.number().optional(),
        price: z.coerce.number().optional(),
        year: z.coerce.number().optional(),
        removedPhotoIds: z.string().transform(x => x.split(',').map(x => x.trim()))
    }),
    response: undefined
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ activeUser, payload, req }) => {
        const service = DIContainer()._CarSaleUserService(activeUser.id)
        const formData = await req.formData()
        let newPhotos = undefined
        if (formData.has('photos')) {
            newPhotos = formData.getAll('photos') as File[]
        }

        await service.updateDraft({ ...payload, newPhotos })
    }
})
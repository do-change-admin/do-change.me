import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { testContainer } from "@/di-containers";
import { CarSaleUserServiceFactory, ServiceTokens } from "@/di-containers/tokens.di-container";
import { createDraftCarForSaleUserServicePayloadSchema } from "@/services";

const schemas = {
    body: undefined,
    query: createDraftCarForSaleUserServicePayloadSchema,
    response: undefined
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ activeUser, payload, req }) => {
        const service = testContainer.get<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)(activeUser.id)
        const formData = await req.formData()
        let photos = undefined
        if (formData.has('photos')) {
            photos = formData.getAll('photos') as File[]
        }
        await service.createDraft({ ...payload, photos })
    }
})
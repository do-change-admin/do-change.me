import { postCarForSaleUserServicePayloadSchema } from "@/services";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { testContainer } from "@/di-containers";
import { CarSaleUserServiceFactory, ServiceTokens } from "@/di-containers/tokens.di-container";

const schemas = {
    body: undefined,
    query: postCarForSaleUserServicePayloadSchema,
    response: undefined
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload, activeUser, req }) => {
        const formData = await req.formData()
        const photos = formData.getAll('photos') as File[]
        const service = testContainer.get<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)(activeUser.id)
        await service.post({
            ...payload,
            photos
        })
    }
})
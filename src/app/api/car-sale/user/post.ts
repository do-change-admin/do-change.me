import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { getContainer } from "@/di-containers";
import { CarSaleUserServiceFactory, ServiceTokens } from "@/di-containers/tokens.di-container";
import { Services } from "@/services";

const schemas = {
    body: undefined,
    query: Services.CarSaleUser.postCarPayloadSchema,
    response: undefined
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload, activeUser, req }) => {
        const formData = await req.formData()
        const photos = formData.getAll('photos') as File[]
        const container = getContainer()
        const service = container.get<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)(activeUser.id)
        await service.post({
            ...payload,
            photos
        })
    }
})
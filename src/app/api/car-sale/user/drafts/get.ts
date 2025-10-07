import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { getDIContainer } from "@/di-containers";
import { CarSaleUserServiceFactory, ServiceTokens } from "@/di-containers/tokens.di-container";
import { carForSaleUserDraftSchema } from "@/entities";
import { Services } from "@/services";

const schemas = {
    query: Services.CarSaleUser.findDraftPayloadSchema,
    body: undefined,
    response: carForSaleUserDraftSchema
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload, activeUser }) => {
        const container = getDIContainer()
        const service = container.get<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)(activeUser.id)
        const result = await service.findDraft(payload)
        return result
    }
})
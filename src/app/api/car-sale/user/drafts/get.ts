import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { testContainer } from "@/di-containers";
import { CarSaleUserServiceFactory, ServiceTokens } from "@/di-containers/tokens.di-container";
import { carForSaleUserDraftSchema } from "@/entities";
import { findDraftCarForSaleUserServicePayloadSchema } from "@/services";

const schemas = {
    query: findDraftCarForSaleUserServicePayloadSchema,
    body: undefined,
    response: carForSaleUserDraftSchema
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload, activeUser }) => {
        const service = testContainer.get<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)(activeUser.id)
        const result = await service.findDraft(payload)
        return result
    }
})
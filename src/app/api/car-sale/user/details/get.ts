import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { testContainer } from "@/di-containers";
import { CarSaleUserServiceFactory, ServiceTokens } from "@/di-containers/tokens.di-container";
import { carForSaleUserDetailSchema } from "@/entities";
import { findSpecificCarForSaleUserServicePayloadSchema } from "@/services";

const schemas = {
    body: undefined,
    query: findSpecificCarForSaleUserServicePayloadSchema,
    response: carForSaleUserDetailSchema
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ activeUser, payload }) => {
        const service = testContainer.get<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)(activeUser.id)
        const detailedItem = await service.details(payload)
        return detailedItem
    }
})
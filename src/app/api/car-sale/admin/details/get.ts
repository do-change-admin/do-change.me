import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { getDIContainer } from "@/di-containers";
import { ServiceTokens } from "@/di-containers/tokens.di-container";
import { carForSaleAdminDetailSchema } from "@/entities";
import { Services } from "@/services";

const schemas = {
    body: undefined,
    query: Services.CarSaleAdmin.findDetailsPayloadSchema,
    response: carForSaleAdminDetailSchema
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const container = getDIContainer()
        const service = container.get<Services.CarSaleAdmin.Instance>(ServiceTokens.carSaleAdmin)
        const details = await service.details(payload)
        return details
    }
})
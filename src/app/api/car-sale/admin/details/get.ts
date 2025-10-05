import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { testContainer } from "@/di-containers";
import { ServiceTokens } from "@/di-containers/tokens.di-container";
import { carForSaleAdminDetailSchema } from "@/entities";
import { CarSaleAdminService, findSpecificCarForSaleAdminServicePayloadSchema } from "@/services";

const schemas = {
    body: undefined,
    query: findSpecificCarForSaleAdminServicePayloadSchema,
    response: carForSaleAdminDetailSchema
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const service = testContainer.get<CarSaleAdminService>(ServiceTokens.carSaleAdmin)
        const details = await service.details(payload)
        return details
    }
})
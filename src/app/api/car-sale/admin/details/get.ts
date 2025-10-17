import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { DIContainer } from "@/di-containers";
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
        const service = DIContainer()._CarSaleAdminService()
        const details = await service.details(payload)
        return details
    }
})
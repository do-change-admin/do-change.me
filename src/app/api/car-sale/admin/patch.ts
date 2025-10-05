import { CarSaleAdminService, setCarSaleStatusAdminServicePayloadSchema } from "@/services";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { testContainer } from "@/di-containers";
import { ServiceTokens } from "@/di-containers/tokens.di-container";

const schemas = {
    query: undefined,
    body: setCarSaleStatusAdminServicePayloadSchema,
    response: undefined
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const service = testContainer.get<CarSaleAdminService>(ServiceTokens.carSaleAdmin)
        await service.setStatus(payload)
    }
})
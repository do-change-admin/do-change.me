import { Services } from "@/services";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { testContainer } from "@/di-containers";
import { ServiceTokens } from "@/di-containers/tokens.di-container";

const schemas = {
    query: undefined,
    body: Services.CarSaleAdmin.updatePayloadSchema,
    response: undefined
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const service = testContainer.get<Services.CarSaleAdmin.Instance>(ServiceTokens.carSaleAdmin)
        await service.update(payload)
    }
})
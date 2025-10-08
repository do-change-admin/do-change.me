import { CarSaleSellsService, setCarSaleStatusSellsServicePayloadSchema } from "@/services";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { testContainer } from "@/di-containers";
import { ServicesTokens } from "@/di-containers/tokens.di-container";

const schemas = {
    query: undefined,
    body: setCarSaleStatusSellsServicePayloadSchema,
    response: undefined
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const service = testContainer.get<CarSaleSellsService>(ServicesTokens.carSaleSells)
        await service.setStatus(payload)
    }
})
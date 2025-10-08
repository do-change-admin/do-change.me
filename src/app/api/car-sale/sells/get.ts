import { CarSaleSellsService, findCarsForSaleSellsServicePayloadSchema } from "@/services";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import z from "zod";
import { carForSaleSellsListSchema } from "@/entities";
import { testContainer } from "@/di-containers";
import { ServicesTokens } from "@/di-containers/tokens.di-container";

const schemas = {
    body: undefined,
    query: findCarsForSaleSellsServicePayloadSchema,
    response: z.object({
        items: z.array(carForSaleSellsListSchema)
    })
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const service = testContainer.get<CarSaleSellsService>(ServicesTokens.carSaleSells)
        const items = await service.list(payload)
        return { items }
    }
})
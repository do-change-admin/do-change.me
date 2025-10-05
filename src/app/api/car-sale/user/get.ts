import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import z from "zod";
import { carForSaleUserListSchema } from "@/entities";
import { findCarsForSaleUserServicePayloadSchema } from "@/services";
import { testContainer } from "@/di-containers";
import { CarSaleUserServiceFactory, ServiceTokens } from "@/di-containers/tokens.di-container";

const schemas = {
    body: undefined,
    query: findCarsForSaleUserServicePayloadSchema,
    response: z.object({
        items: z.array(carForSaleUserListSchema)
    })
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload, activeUser }) => {
        const service = testContainer.get<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)(activeUser.id)
        const items = await service.findList(payload)
        return { items }
    }
})
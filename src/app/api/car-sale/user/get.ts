import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import z from "zod";
import { carForSaleUserListSchema } from "@/entities";
import { getDIContainer } from "@/di-containers";
import { CarSaleUserServiceFactory, ServiceTokens } from "@/di-containers/tokens.di-container";
import { Services } from "@/services";

const schemas = {
    body: undefined,
    query: Services.CarSaleUser.findCarsPayloadSchema,
    response: z.object({
        items: z.array(carForSaleUserListSchema)
    })
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload, activeUser }) => {
        const container = getDIContainer()
        const service = container.get<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)(activeUser.id)
        const items = await service.findList(payload)
        return { items }
    }
})
import { Services } from "@/services";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import z from "zod";
import { carForSaleAdminListSchema } from "@/entities";
import { getDIContainer } from "@/di-containers";
import { ServiceTokens } from "@/di-containers/tokens.di-container";

const schemas = {
    body: undefined,
    query: Services.CarSaleAdmin.findListPayloadSchema,
    response: z.object({
        items: z.array(carForSaleAdminListSchema)
    })
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const container = getDIContainer()
        const service = container.get<Services.CarSaleAdmin.Instance>(ServiceTokens.carSaleAdmin)
        const items = await service.list(payload)
        return { items }
    }
})
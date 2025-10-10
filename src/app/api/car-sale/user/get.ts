import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import z from "zod";
import { carForSaleUserListSchema } from "@/entities";
import { DIContainer } from "@/di-containers";
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
        const service = DIContainer().CarSaleUserService(activeUser.id)
        const items = await service.findList(payload)
        return { items }
    }
})
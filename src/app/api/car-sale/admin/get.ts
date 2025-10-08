import { Services } from "@/services";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import z from "zod";
import { carForSaleAdminListSchema } from "@/entities";
import { DIContainer } from "@/di-containers";

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
        const service = DIContainer().CarSaleAdminService()
        const items = await service.list(payload)
        return { items }
    }
})
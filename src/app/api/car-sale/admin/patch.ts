import { Services } from "@/services";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { DIContainer } from "@/di-containers";

const schemas = {
    query: undefined,
    body: Services.CarSaleAdmin.updatePayloadSchema,
    response: undefined
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const service = DIContainer().CarSaleAdminService()
        await service.update(payload)
    }
})
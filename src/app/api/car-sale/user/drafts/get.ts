import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { DIContainer } from "@/di-containers";
import { carForSaleUserDraftSchema } from "@/entities";
import { Services } from "@/services";

const schemas = {
    query: Services.CarSaleUser.findDraftPayloadSchema,
    body: undefined,
    response: carForSaleUserDraftSchema
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload, activeUser }) => {
        const service = DIContainer()._CarSaleUserService(activeUser.id)
        const result = await service.findDraft(payload)
        return result
    }
})
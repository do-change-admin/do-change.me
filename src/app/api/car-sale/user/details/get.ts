import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { carForSaleUserDetailSchema } from "@/entities";
import { carsForSaleInMemoryDataProvider } from "@/providers";
import { VercelBlobFileSystemProvider } from "@/providers/implementations";
import { CarSaleUserService, findSpecificCarForSaleUserServicePayloadSchema } from "@/services";

const schemas = {
    body: undefined,
    query: findSpecificCarForSaleUserServicePayloadSchema,
    response: carForSaleUserDetailSchema
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ activeUser, payload }) => {
        const service = new CarSaleUserService(carsForSaleInMemoryDataProvider, new VercelBlobFileSystemProvider(), activeUser.id)
        const detailedItem = await service.details(payload)
        return detailedItem
    }
})
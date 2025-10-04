import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { carForSaleSellsDetailSchema } from "@/entities";
import { carsForSaleInMemoryDataProvider } from "@/providers";
import { VercelBlobFileSystemProvider } from "@/providers/implementations";
import { CarSaleSellsService, findSpecificCarForSaleSellsServicePayloadSchema } from "@/services";

const schemas = {
    body: undefined,
    query: findSpecificCarForSaleSellsServicePayloadSchema,
    response: carForSaleSellsDetailSchema
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const service = new CarSaleSellsService(carsForSaleInMemoryDataProvider, new VercelBlobFileSystemProvider())
        const details = await service.details(payload)
        return details
    }
})
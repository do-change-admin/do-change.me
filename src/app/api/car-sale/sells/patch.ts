import { CarSaleSellsService, setCarSaleStatusSellsServicePayloadSchema } from "@/services";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { carsForSaleInMemoryDataProvider } from "@/providers";
import { VercelBlobFileSystemProvider } from "@/providers/implementations";

const schemas = {
    query: undefined,
    body: setCarSaleStatusSellsServicePayloadSchema,
    response: undefined
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const service = new CarSaleSellsService(carsForSaleInMemoryDataProvider, new VercelBlobFileSystemProvider())
        await service.setStatus(payload)
    }
})
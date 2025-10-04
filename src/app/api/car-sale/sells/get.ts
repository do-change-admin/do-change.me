import { CarSaleSellsService, findCarsForSaleSellsServicePayloadSchema } from "@/services";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import z from "zod";
import { carForSaleSellsListSchema } from "@/entities";
import { carsForSaleInMemoryDataProvider } from "@/providers";
import { VercelBlobFileSystemProvider } from "@/providers/implementations";

const schemas = {
    body: undefined,
    query: findCarsForSaleSellsServicePayloadSchema,
    response: z.object({
        items: z.array(carForSaleSellsListSchema)
    })
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const service = new CarSaleSellsService(carsForSaleInMemoryDataProvider, new VercelBlobFileSystemProvider())
        const items = await service.list(payload)
        return { items }
    }
})
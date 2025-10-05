import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { testContainer } from "@/di-containers";
import { ServicesTokens } from "@/di-containers/tokens.di-container";
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
        const service = testContainer.get<CarSaleSellsService>(ServicesTokens.carSaleSells)
        const details = await service.details(payload)
        return details
    }
})
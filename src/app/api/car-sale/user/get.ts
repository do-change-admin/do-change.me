import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import z from "zod";
import { carForSaleUserListSchema } from "@/entities";
import { CarSaleUserService, findCarsForSaleUserServicePayloadSchema } from "@/services";
import { carsForSaleInMemoryDataProvider } from "@/providers";
import { PublicFolderFileSystemProvider, VercelBlobFileSystemProvider } from "@/providers/implementations";

const schemas = {
    body: undefined,
    query: findCarsForSaleUserServicePayloadSchema,
    response: z.object({
        items: z.array(carForSaleUserListSchema)
    })
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload, activeUser }) => {
        const service = new CarSaleUserService(carsForSaleInMemoryDataProvider, new VercelBlobFileSystemProvider(), activeUser.id)
        const items = await service.findList(payload)
        return { items }
    }
})
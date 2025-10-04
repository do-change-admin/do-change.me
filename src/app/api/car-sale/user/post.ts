import { CarSaleUserService, postCarForSaleUserServicePayloadSchema } from "@/services";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { carsForSaleInMemoryDataProvider, CarsForSaleInMemoryDataProvider } from "@/providers";
import { VercelBlobFileSystemProvider } from "@/providers/implementations";

const schemas = {
    body: undefined,
    query: postCarForSaleUserServicePayloadSchema,
    response: undefined
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload, activeUser, req }) => {
        const formData = await req.formData()
        const photo = formData.get('photo') as File
        const service = new CarSaleUserService(carsForSaleInMemoryDataProvider, new VercelBlobFileSystemProvider(), activeUser.id)
        await service.post({
            photo,
            licencePlate: payload.licencePlate,
            mileage: payload.mileage
        })
    }
})
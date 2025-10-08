import { postCarForSaleUserServicePayloadSchema } from "@/services";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { testContainer } from "@/di-containers";
import { CarSaleUserServiceFactory, ServicesTokens } from "@/di-containers/tokens.di-container";

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
        const service = testContainer.get<CarSaleUserServiceFactory>(ServicesTokens.carSaleUserFactory)(activeUser.id)
        await service.post({
            photo,
            licencePlate: payload.licencePlate,
            mileage: payload.mileage
        })
    }
})
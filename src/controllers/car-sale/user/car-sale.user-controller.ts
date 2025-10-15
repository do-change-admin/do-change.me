import { zodApiMethod } from "@/app/api/zod-api-methods";
import { inject, injectable } from "inversify";
import { GET_Schemas, POST_Schemas } from "./car-sale.user-controller.models";
import { type CarSaleUserServiceFactory } from "@/di-containers/register-services";
import { ServiceTokens } from "@/di-containers/tokens.di-container";

@injectable()
export class Instance {
    public constructor(
        @inject(ServiceTokens.carSaleUserFactory) private readonly userServiceFactory: CarSaleUserServiceFactory
    ) { }

    GET = zodApiMethod(GET_Schemas, {
        handler: async ({ payload, activeUser }) => {
            const service = this.userServiceFactory(activeUser.id)
            const items = await service.findList(payload)
            return { items }
        }
    })

    POST = zodApiMethod(POST_Schemas, {
        handler: async ({ payload, activeUser, req }) => {
            const formData = await req.formData()
            const photos = formData.getAll('photos') as File[]
            const service = this.userServiceFactory(activeUser.id)
            await service.post({
                ...payload,
                photos
            })
        }
    })
}
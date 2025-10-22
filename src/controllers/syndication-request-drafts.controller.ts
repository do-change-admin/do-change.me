import { ZodAPIController, zodApiMethod, ZodControllerSchemas } from "@/app/api/zod-api-methods";
import { type SyndicationRequestDraftsServiceFactory } from "@/di-containers/register-services";
import { ServiceTokens } from "@/di-containers/tokens.di-container";
import { SyndicationRequestDraftsService } from "@/services/syndication-request-drafts.service";
import { VIN } from "@/value-objects/vin.value-object";
import { inject, injectable } from "inversify";
import z from "zod";

const schemas = {
    GET: {
        query: z.object({
            make: z.string().optional(),
            model: z.string().optional(),
            vin: z.string().optional()
        }),
        body: undefined,
        response: z.object({
            items: z.array(
                SyndicationRequestDraftsService.dtoSchema
            )
        })
    },

    Details_GET: {
        query: z.object({
            id: z.string().nonempty()
        }),
        body: undefined,
        response: SyndicationRequestDraftsService.dtoSchema
    },

    PATCH: {
        query: z.object({
            id: z.string(),
            make: z.string().nonempty().optional(),
            mileage: z.coerce.number().optional(),
            model: z.string().nonempty().optional(),
            price: z.coerce.number().optional(),
            vin: VIN.schema.optional(),
            year: z.coerce.number().optional(),
            photoIdsToBeRemoved: z.string().optional().transform(x => x ? x.split(',') : undefined)
        }),
        body: undefined,
        response: undefined
    },

    POST: {
        query: z.object({
            make: z.string().nonempty().optional(),
            mileage: z.coerce.number().optional(),
            model: z.string().nonempty().optional(),
            price: z.coerce.number().optional(),
            vin: VIN.schema.optional(),
            year: z.coerce.number().optional(),
        }),
        body: undefined,
        response: z.object({
            id: z.string().nonempty()
        })

    }
} satisfies ZodControllerSchemas

@injectable()
export class SyndicationRequestDraftsController {
    public constructor(
        @inject(ServiceTokens.syndicationRequestDraftsFactory) private readonly serviceFactory: SyndicationRequestDraftsServiceFactory
    ) { }

    GET = zodApiMethod(schemas.GET, {
        handler: async ({ activeUser, payload }) => {
            const service = this.serviceFactory(activeUser.id)
            const items = await service.list(payload)
            return { items }
        }
    })

    Details_GET = zodApiMethod(schemas.Details_GET, {
        handler: async ({ activeUser, payload }) => {
            const service = this.serviceFactory(activeUser.id)
            return await service.details(payload.id)
        }
    })

    PATCH = zodApiMethod(schemas.PATCH, {
        handler: async ({ activeUser, payload, req }) => {
            const formData = await req.formData()
            const photos = (formData?.getAll('photos') ?? []) as File[]

            const service = this.serviceFactory(activeUser.id)
            await service.update({
                ...payload,
                photos: photos.length > 0 ? photos : undefined
            })
        }
    })

    POST = zodApiMethod(schemas.POST, {
        handler: async ({ activeUser, payload, req }) => {
            const formData = await req.formData()
            const photos = (formData?.getAll('photos') ?? []) as File[]

            const service = this.serviceFactory(activeUser.id)
            return await service.post({
                ...payload,
                photos: photos.length > 0 ? photos : undefined
            })
        }
    })
}

/**
 * В PATCH и POST методы телом метода должна быть
 * FormData с ключом photos, в котором находятся фотографии,
 * которые должны быть ассоциированы с черновиком заявки.
 */
export type SyndicationRequestDraftsAPI = ZodAPIController<typeof schemas>
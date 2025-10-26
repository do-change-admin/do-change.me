import { ZodAPIController, zodApiMethod, ZodControllerSchemas } from "@/app/api/zod-api-methods";
import { type SyndicationRequestDraftsServiceFactory, type SyndicationRequestsServiceFactory } from "@/backend/di-containers/register-services";
import { FunctionProviderTokens, ServiceTokens } from "@/backend/di-containers/tokens.di-container";
import { SyndicationRequestStatus } from "@/entities/sindycation-request-status.entity";
import { FunctionProviders } from "@/backend/providers";
import { SyndicationRequestsService } from "@/backend/services/syndication-requests.service";
import { ErrorFactory } from "@/value-objects/errors.value-object";
import { VIN } from "@/value-objects/vin.value-object";
import { inject, injectable } from "inversify";
import z from "zod";

const schemas = {
    GET: {
        body: undefined,
        query: z.object({
            status: SyndicationRequestStatus.activeStatusesNameSchema,
            make: z.string().optional(),
            model: z.string().optional(),
            vin: z.string().optional()
        }),
        response: z.object({
            items: z.array(SyndicationRequestsService.dtoSchema)
        })
    },

    POST: {
        response: z.object({
            id: z.string()
        }),
        query: z.object({
            make: z.string().nonempty(),
            mileage: z.coerce.number(),
            model: z.string().nonempty(),
            price: z.coerce.number(),
            vin: VIN.schema,
            year: z.coerce.number()
        }),
        body: undefined
    },

    FromDraft_POST: {
        body: undefined,
        query: z.object({
            draftId: z.string().nonempty()
        }),
        response: z.object({
            id: z.string()
        }),
    },

    Filters_GET: {
        body: undefined,
        query: undefined,
        response: z.object({
            models: z.array(z.string()),
            makes: z.array(z.string())
        })
    }
} satisfies ZodControllerSchemas

const errorFactory = ErrorFactory.forController('Syndication requests')

@injectable()
export class SyndicationRequestsController {
    public constructor(
        @inject(ServiceTokens.syndicationRequestsFactory) private readonly serviceFactory: SyndicationRequestsServiceFactory,
        @inject(ServiceTokens.syndicationRequestDraftsFactory) private readonly draftsServiceFactory: SyndicationRequestDraftsServiceFactory,
        @inject(FunctionProviderTokens.logger) private readonly logger: FunctionProviders.Logger.Interface
    ) { }

    GET = zodApiMethod(schemas.GET, {
        handler: async ({ activeUser, payload }) => {
            const { newError } = errorFactory.inMethod('GET')
            try {
                const service = this.serviceFactory(activeUser.id)
                const items = await service.list(payload)
                return { items }
            } catch (e) {
                this.logger.error(
                    newError({ error: 'Could not obtain items' }, e)
                )
                return { items: [] }
            }
        }
    })

    POST = zodApiMethod(schemas.POST, {
        handler: async ({ activeUser, payload, req }) => {
            const formData = await req.formData()
            const photos = formData.getAll('photos') as File[]

            const service = this.serviceFactory(activeUser.id)
            return await service.post({
                photos,
                ...payload
            })
        }
    })

    FromDraft_POST = zodApiMethod(schemas.FromDraft_POST, {
        handler: async ({ activeUser, payload }) => {
            const service = this.draftsServiceFactory(activeUser.id)
            return await service.createRequest(payload.draftId)
        }
    })

    Filters_GET = zodApiMethod(schemas.Filters_GET, {
        handler: async ({ activeUser, payload }) => {
            const service = this.serviceFactory(activeUser.id)
            return await service.allFilters()
        }
    })
}

/**
 * В POST методе телом метода должна быть
 * FormData с ключом photos, в котором находятся фотографии,
 * которые должны быть ассоциированы с создаваемой заявкой.
 */
export type SyndicationRequestsAPI = ZodAPIController<typeof schemas>


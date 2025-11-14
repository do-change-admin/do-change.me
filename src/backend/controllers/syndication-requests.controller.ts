import { ZodAPIController, zodApiMethod, ZodControllerSchemas } from "@/backend/utils/zod-api-controller____DEPRECATED.utils";
import { type SyndicationRequestDraftsServiceFactory, type SyndicationRequestsServiceFactory } from "@/backend/di-containers/register-services";
import { ProviderTokens, ServiceTokens } from "@/backend/di-containers/tokens.di-container";
import { SyndicationRequestStatus } from "@/entities/sindycation-request-status.entity";
import { FunctionProviders } from "@/backend/providers";
import { SyndicationRequestsService, syndicationRequestsServiceSchemas } from "@/backend/services/syndication-requests.service";
import { ErrorFactory } from "@/value-objects/errors.value-object";
import { VIN } from "@/value-objects/vin.value-object";
import { inject, injectable } from "inversify";
import z from "zod";
import { ZodController } from "../utils/zod-controller.utils";

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
    },

    PATCH: {
        body: undefined,
        query: syndicationRequestsServiceSchemas.addPhotos.payload.pick({ id: true }),
        response: undefined
    }
} satisfies ZodControllerSchemas

@injectable()
export class SyndicationRequestsController extends ZodController('Syndication requests', schemas) {
    public constructor(
        @inject(ServiceTokens.syndicationRequestsFactory) private readonly serviceFactory: SyndicationRequestsServiceFactory,
        @inject(ServiceTokens.syndicationRequestDraftsFactory) private readonly draftsServiceFactory: SyndicationRequestDraftsServiceFactory,
    ) {
        super()
    }

    GET = this.loggedEndpoint('GET', {
        handler: async ({ activeUser, payload }) => {
            const service = this.serviceFactory(activeUser.id)
            const items = await service.list(payload)
            return { items }
        }
    })

    POST = this.loggedEndpoint('POST', {
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

    FromDraft_POST = this.loggedEndpoint('FromDraft_POST', {
        handler: async ({ activeUser, payload }) => {
            const service = this.draftsServiceFactory(activeUser.id)
            return await service.createRequest(payload.draftId)
        }
    })

    Filters_GET = this.loggedEndpoint('Filters_GET', {
        handler: async ({ activeUser }) => {
            const service = this.serviceFactory(activeUser.id)
            return await service.allFilters()
        }
    })

    PATCH = this.loggedEndpoint('PATCH', {
        handler: async ({ payload: { id }, activeUser, req }) => {
            const service = this.serviceFactory(activeUser.id)
            const formData = await req.formData()
            const photos = formData.getAll('photos') as File[]
            await service.addPhotos({ photos, id })
        }
    })
}

/**
 * В POST методе телом метода должна быть
 * FormData с ключом photos, в котором находятся фотографии,
 * которые должны быть ассоциированы с создаваемой заявкой.
 */
export type SyndicationRequestsAPI = ZodAPIController<typeof schemas>


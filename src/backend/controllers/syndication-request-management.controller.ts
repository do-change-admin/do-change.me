import { ZodAPIController, zodApiMethod, ZodControllerSchemas } from "@/backend/utils/zod-api-controller.utils";
import { ServiceTokens } from "@/backend/di-containers/tokens.di-container";
import { SyndicationRequestStatus } from "@/entities/sindycation-request-status.entity";
import { SyndicationRequestManagementService } from "@/backend/services/syndication-request-management.service";
import { VIN } from "@/value-objects/vin.value-object";
import { inject, injectable } from "inversify";
import z from "zod";

const schemas = {
    GET: {
        body: undefined,
        response: z.object({
            items: z.array(SyndicationRequestManagementService.dtoSchema)
        }),
        query: z.object({
            status: SyndicationRequestStatus.activeStatusesNameSchema,
            make: z.string().optional(),
            model: z.string().optional(),
            vin: VIN.schema.optional()
        })
    },

    PATCH: {
        body: z.object({
            status: SyndicationRequestStatus.activeStatusesNameSchema.optional(),
            marketplaceLinks: z.array(z.url()).optional()
        }),
        query: z.object({
            id: z.string().nonempty(),
            userId: z.string().nonempty()
        }),
        response: undefined
    },

    Details_GET: {
        query: z.object({
            id: z.string().nonempty(),
            userId: z.string().nonempty()
        }),
        body: undefined,
        response: SyndicationRequestManagementService.dtoSchema
    },

    Filters_GET: {
        query: undefined,
        body: undefined,
        response: z.object({
            makes: z.array(z.string()),
            models: z.array(z.string())
        })
    }
} satisfies ZodControllerSchemas

@injectable()
export class SyndicationRequestManagementController {
    public constructor(
        @inject(ServiceTokens.syndicationRequestManagement) private readonly service: SyndicationRequestManagementService
    ) { }

    GET = zodApiMethod(schemas.GET, {
        handler: async ({ payload }) => {
            const items = await this.service.requests(payload)

            return { items }
        }
    })

    PATCH = zodApiMethod(schemas.PATCH, {
        handler: async ({ payload }) => {
            await this.service.updateRequest({
                id: payload.id,
                userId: payload.userId,
                marketplaceLinks: payload.marketplaceLinks,
                status: payload.status
            })
        }
    })

    Details_GET = zodApiMethod(schemas.Details_GET, {
        handler: async ({ payload }) => {
            return await this.service.requestDetails(payload.id, payload.userId)
        }
    })

    Filters_GET = zodApiMethod(schemas.Filters_GET, {
        handler: async () => {
            return await this.service.allFilters()
        }
    })
}

export type SyndicationRequestManagementAPI = ZodAPIController<typeof schemas>
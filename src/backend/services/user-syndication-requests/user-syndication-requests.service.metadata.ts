import z from 'zod';
import { userSyndicationRequestStoreSchemas } from '@/backend/stores/user-syndication-request';
import type { ZodServiceDTOs, ZodServiceMetadata } from '@/backend/utils/zod-service.utils';
import { UserSyndicationRequest } from '@/entities/syndication-request';
import { Identifier } from '@/utils/entities/identifier';

export const userSyndicationRequestsServiceMetadata = {
    name: 'UserSyndicationRequests',
    schemas: {
        list: {
            payload: userSyndicationRequestStoreSchemas.searchPayload.list,
            response: z.object({ items: z.array(UserSyndicationRequest.schema) })
        },

        details: {
            payload: userSyndicationRequestStoreSchemas.searchPayload.specific,
            response: UserSyndicationRequest.schema
        },

        post: {
            payload: userSyndicationRequestStoreSchemas.actionsPayload.create,
            response: UserSyndicationRequest.schema.pick({ id: true })
        },

        createFromDraft: {
            payload: z.object({ draftId: Identifier.schema }),
            response: z.object({ id: Identifier.schema })
        },

        /**
         * TODO - вынести фильтры драфтов в сервис драфтов
         */
        filters: userSyndicationRequestStoreSchemas.customOperations.filtersData,

        update: {
            payload: userSyndicationRequestStoreSchemas.actionsPayload.update.extend({ id: Identifier.schema }),
            response: z.object({})
        }
    }
} satisfies ZodServiceMetadata;

export type UserSyndicationRequestsServiceDTOs = ZodServiceDTOs<typeof userSyndicationRequestsServiceMetadata>;

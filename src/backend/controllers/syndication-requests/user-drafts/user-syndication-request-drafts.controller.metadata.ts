import { userSyndicationRequestDraftsServiceMetadata } from '@/backend/services/syndication-requests/user-drafts';
import type { ZodControllerAPI, ZodControllerMetadata } from '@/backend/utils/zod-controller.utils';

export const userSyndicationRequestDraftsControllerMetadata = {
    name: 'UserSyndicationRequestDrafts',
    schemas: {
        GET: {
            query: userSyndicationRequestDraftsServiceMetadata.schemas.list.payload,
            response: userSyndicationRequestDraftsServiceMetadata.schemas.list.response
        },

        Details_GET: {
            query: userSyndicationRequestDraftsServiceMetadata.schemas.details.payload,
            response: userSyndicationRequestDraftsServiceMetadata.schemas.details.response
        },

        POST: {
            body: userSyndicationRequestDraftsServiceMetadata.schemas.post.payload,
            response: userSyndicationRequestDraftsServiceMetadata.schemas.post.response
        },

        PATCH: {
            body: userSyndicationRequestDraftsServiceMetadata.schemas.update.payload,
            response: userSyndicationRequestDraftsServiceMetadata.schemas.update.response
        },

        Filters_GET: {
            response: userSyndicationRequestDraftsServiceMetadata.schemas.filters.response
        }
    }
} satisfies ZodControllerMetadata;

export type UserSyndicationRequestDraftsAPI = ZodControllerAPI<typeof userSyndicationRequestDraftsControllerMetadata>;

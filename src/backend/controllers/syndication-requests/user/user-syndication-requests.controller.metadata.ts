import { userSyndicationRequestsServiceMetadata } from '@/backend/services/syndication-requests/user';
import type { ZodControllerAPI, ZodControllerMetadata } from '@/backend/utils/zod-controller.utils';

export const userSyndicationRequestsControllerMetadata = {
    name: 'UserSyndicationRequests',
    schemas: {
        GET: {
            query: userSyndicationRequestsServiceMetadata.schemas.list.payload,
            response: userSyndicationRequestsServiceMetadata.schemas.list.response
        },

        POST: {
            body: userSyndicationRequestsServiceMetadata.schemas.post.payload,
            response: userSyndicationRequestsServiceMetadata.schemas.post.response
        },

        Filters_GET: {
            response: userSyndicationRequestsServiceMetadata.schemas.filters.response
        },

        FromDraft_POST: {
            body: userSyndicationRequestsServiceMetadata.schemas.postFromDraft.payload,
            response: userSyndicationRequestsServiceMetadata.schemas.postFromDraft.response
        }
    }
} satisfies ZodControllerMetadata;

export type UserSyndicationRequestsAPI = ZodControllerAPI<typeof userSyndicationRequestsControllerMetadata>;

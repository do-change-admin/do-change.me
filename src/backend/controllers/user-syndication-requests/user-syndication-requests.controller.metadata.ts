import { userSyndicationRequestsServiceMetadata } from '@/backend/services/user-syndication-requests';
import type { ZodControllerAPI, ZodControllerMetadata } from '@/backend/utils/zod-controller.utils';

export const userSyndicationRequestsControllerMetadata = {
    name: 'UserSyndicationRequests',
    schemas: {
        GET: {
            query: userSyndicationRequestsServiceMetadata.schemas.list.payload.omit({ userId: true }),
            body: undefined,
            response: userSyndicationRequestsServiceMetadata.schemas.list.response
        },

        POST: {
            query: undefined,
            body: userSyndicationRequestsServiceMetadata.schemas.post.payload.omit({ userId: true }),
            response: userSyndicationRequestsServiceMetadata.schemas.post.response
        },

        Filters_GET: {
            query: undefined,
            body: undefined,
            response: userSyndicationRequestsServiceMetadata.schemas.filters.response
        },

        FromDraft_POST: {
            query: undefined,
            body: userSyndicationRequestsServiceMetadata.schemas.createFromDraft.payload,
            response: userSyndicationRequestsServiceMetadata.schemas.createFromDraft.response
        }
    }
} satisfies ZodControllerMetadata;

export type UserSyndicationRequestsAPI = ZodControllerAPI<typeof userSyndicationRequestsControllerMetadata>;

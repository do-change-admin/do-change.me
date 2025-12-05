import { userSyndicationRequestDraftsServiceMetadata } from '@/backend/services/user-syndication-request-drafts';
import type { ZodControllerAPI, ZodControllerMetadata } from '@/backend/utils/zod-controller.utils';

export const userSyndicationRequestDraftsControllerMetadata = {
    name: 'UserSyndicationRequestDrafts',
    schemas: {
        GET: {
            body: undefined,
            query: userSyndicationRequestDraftsServiceMetadata.schemas.list.payload.omit({ userId: true }),
            response: userSyndicationRequestDraftsServiceMetadata.schemas.list.response
        },

        Details_GET: {
            body: undefined,
            query: userSyndicationRequestDraftsServiceMetadata.schemas.details.payload,
            response: userSyndicationRequestDraftsServiceMetadata.schemas.details.response
        },

        POST: {
            body: userSyndicationRequestDraftsServiceMetadata.schemas.post.payload.omit({ userId: true }),
            query: undefined,
            response: userSyndicationRequestDraftsServiceMetadata.schemas.post.response
        },

        PATCH: {
            query: undefined,
            body: userSyndicationRequestDraftsServiceMetadata.schemas.update.payload,
            response: userSyndicationRequestDraftsServiceMetadata.schemas.update.response
        }
    }
} satisfies ZodControllerMetadata;

export type UserSyndicationRequestDraftsAPI = ZodControllerAPI<typeof userSyndicationRequestDraftsControllerMetadata>;

import { userSyndicationRequestsServiceMetadata } from '@/backend/services/user-syndication-requests';
import type { ZodControllerAPI, ZodControllerMetadata } from '@/backend/utils/zod-controller.utils';

export const userSyndicationRequestsManagementControllerMetadata = {
    name: 'UserSyndicationRequestsManagement',
    schemas: {
        GET: {
            query: userSyndicationRequestsServiceMetadata.schemas.list.payload,
            body: undefined,
            response: userSyndicationRequestsServiceMetadata.schemas.list.response
        },

        Details_GET: {
            query: userSyndicationRequestsServiceMetadata.schemas.details.payload,
            body: undefined,
            response: userSyndicationRequestsServiceMetadata.schemas.details.response
        },

        PATCH: {
            query: userSyndicationRequestsServiceMetadata.schemas.update.payload,
            body: undefined,
            response: userSyndicationRequestsServiceMetadata.schemas.update.response
        },

        Filters_GET: {
            query: undefined,
            body: undefined,
            response: userSyndicationRequestsServiceMetadata.schemas.filters.response
        }
    }
} satisfies ZodControllerMetadata;

export type UserSyndicationRequestsManagementAPI = ZodControllerAPI<
    typeof userSyndicationRequestsManagementControllerMetadata
>;

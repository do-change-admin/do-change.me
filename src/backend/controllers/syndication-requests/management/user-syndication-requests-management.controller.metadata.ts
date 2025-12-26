import { syndicationRequestsManagementServiceMetadata } from '@/backend/services/syndication-requests/management';
import type { ZodControllerAPI, ZodControllerMetadata } from '@/backend/utils/zod-controller.utils';

export const syndicationRequestsManagementControllerMetadata = {
    name: 'SyndicationRequestsManagement',
    schemas: {
        GET: {
            query: syndicationRequestsManagementServiceMetadata.schemas.list.payload,
            response: syndicationRequestsManagementServiceMetadata.schemas.list.response
        },

        Details_GET: {
            query: syndicationRequestsManagementServiceMetadata.schemas.details.payload,
            response: syndicationRequestsManagementServiceMetadata.schemas.details.response
        },

        PATCH: {
            body: syndicationRequestsManagementServiceMetadata.schemas.update.payload,
            response: syndicationRequestsManagementServiceMetadata.schemas.update.response
        },

        Filters_GET: {
            response: syndicationRequestsManagementServiceMetadata.schemas.filters.response
        }
    }
} satisfies ZodControllerMetadata;

export type SyndicationRequestsManagementAPI = ZodControllerAPI<typeof syndicationRequestsManagementControllerMetadata>;

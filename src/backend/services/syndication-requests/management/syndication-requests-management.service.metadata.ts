import z from 'zod';
import { userSyndicationRequestStoreSchemas } from '@/backend/stores/user-syndication-request';
import type { ZodServiceDTOs, ZodServiceMetadata } from '@/backend/utils/zod-service.utils';
import { UserSyndicationRequest } from '@/entities/syndication-request';
import { Identifier } from '@/utils/entities/identifier';

export const syndicationRequestsManagementServiceMetadata = {
    name: 'SyndicationRequestsManagement',
    schemas: {
        /**
         * Получение списка всех заявок на синдикацию.
         */
        list: {
            payload: userSyndicationRequestStoreSchemas.searchPayload.list.omit({ userId: true }),
            response: z.object({ items: z.array(UserSyndicationRequest.schema) })
        },

        /**
         * Получение детальной информации по заявке на синдикацию.
         */
        details: {
            payload: userSyndicationRequestStoreSchemas.searchPayload.specific,
            response: UserSyndicationRequest.schema
        },

        /**
         * Получение данных для фильтров для заявок на синдикацию.
         */
        filters: {
            payload: z.object({}),
            response: userSyndicationRequestStoreSchemas.customOperations.filtersData.response
        },

        /**
         * Обновление заявки на синдикацию по идентификатору заявки.
         */
        update: {
            payload: userSyndicationRequestStoreSchemas.actionsPayload.update.extend({ id: Identifier.schema }),
            response: z.object({})
        }
    }
} satisfies ZodServiceMetadata;

export type SyndicationRequestsManagementServiceDTOs = ZodServiceDTOs<
    typeof syndicationRequestsManagementServiceMetadata
>;

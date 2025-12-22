import z from 'zod';
import { userSyndicationRequestStoreSchemas } from '@/backend/stores/user-syndication-request';
import type { ZodServiceDTOs, ZodServiceMetadata } from '@/backend/utils/zod-service.utils';
import { UserSyndicationRequest } from '@/entities/syndication-request';
import { Identifier } from '@/utils/entities/identifier';

/**
 * Логика заявок на синдикацию текущего пользователя.
 */
export const userSyndicationRequestsServiceMetadata = {
    name: 'UserSyndicationRequests',
    schemas: {
        /**
         * Получение списка заявок на синдикацию текущего пользователя.
         */
        list: {
            payload: userSyndicationRequestStoreSchemas.searchPayload.list.omit({ userId: true }),
            response: z.object({ items: z.array(UserSyndicationRequest.schema) })
        },

        /**
         * Размещение новой заявки на синдикацию для текущего пользователя. Создание заяки
         * в рамках этого метода происходит с нуля, на основании данных, которые передал пользователь.
         */
        post: {
            payload: userSyndicationRequestStoreSchemas.actionsPayload.create.omit({ userId: true }),
            response: UserSyndicationRequest.schema.pick({ id: true })
        },

        /**
         * Размещение новой заявки на синдикацию для текущего пользователя. Создание заявки
         * в рамках этого метода происходит из уже созданного черновика. Черновик после создания
         * заявки удаляется.
         */
        postFromDraft: {
            payload: z.object({ draftId: Identifier.schema }),
            response: z.object({ id: Identifier.schema })
        },

        /**
         * Получение данных для фильтров для заявок на синдикацию текущего пользователя.
         */
        filters: {
            payload: z.object({}),
            response: userSyndicationRequestStoreSchemas.customOperations.filtersData.response
        }
    }
} satisfies ZodServiceMetadata;

export type UserSyndicationRequestsServiceDTOs = ZodServiceDTOs<typeof userSyndicationRequestsServiceMetadata>;

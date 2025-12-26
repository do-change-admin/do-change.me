import z from 'zod';
import { userSyndicationRequestDraftStoreSchemas } from '@/backend/stores/user-syndication-request-draft';
import type { ZodServiceDTOs, ZodServiceMetadata } from '@/backend/utils/zod-service.utils';
import { UserSyndicationRequestDraft } from '@/entities/syndication-request';
import { Identifier } from '@/utils/entities/identifier';

const serviceItemSchema = UserSyndicationRequestDraft.schema.omit({ additionalPhotoLinks: true }).extend({
    currentPhotos: z.array(
        z.object({
            id: z.string().nonempty(),
            url: z.url()
        })
    )
});

/**
 * Логика черновиков заявок на синдикацию текущего пользователя.
 */
export const userSyndicationRequestDraftsServiceMetadata = {
    name: 'UserSyndicationRequestDrafts',
    schemas: {
        /**
         * Получение списка черновиков заявок на синдикацию для текущего пользователя.
         */
        list: {
            payload: userSyndicationRequestDraftStoreSchemas.searchPayload.list.omit({ userId: true }),
            response: z.object({
                items: z.array(serviceItemSchema)
            })
        },

        /**
         * Получение детальной информации о черновике заявки на синдикацию текущего пользователя.
         */
        details: {
            payload: userSyndicationRequestDraftStoreSchemas.searchPayload.specific,
            response: serviceItemSchema
        },

        /**
         * Публикация нового черновика заявки на синдикацию для текущего пользователя.
         */
        post: {
            payload: userSyndicationRequestDraftStoreSchemas.actionsPayload.create.omit({ userId: true }),
            response: z.object({ id: Identifier.schema })
        },

        /**
         * Обновление черновика заявки на синдикацию для текущего пользователя.
         */
        update: {
            payload: userSyndicationRequestDraftStoreSchemas.actionsPayload.update.extend({
                photoIdsToBeRemoved: z.array(Identifier.schema),
                id: Identifier.schema
            }),
            response: z.object({})
        },

        /**
         * Получение данных для фильтров для черновиков заявок на синдикацию текущего пользователя.
         */
        filters: {
            payload: z.object({}),
            response: userSyndicationRequestDraftStoreSchemas.customOperations.filtersData.response
        }
    }
} satisfies ZodServiceMetadata;

export type UserSyndicationRequestDraftsServiceDTOs = ZodServiceDTOs<
    typeof userSyndicationRequestDraftsServiceMetadata
>;

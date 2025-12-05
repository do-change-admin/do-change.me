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

export const userSyndicationRequestDraftsServiceMetadata = {
    name: 'UserSyndicationRequestDrafts',
    schemas: {
        list: {
            payload: userSyndicationRequestDraftStoreSchemas.searchPayload.list,
            response: z.object({
                items: z.array(serviceItemSchema)
            })
        },

        details: {
            payload: userSyndicationRequestDraftStoreSchemas.searchPayload.specific,
            response: serviceItemSchema
        },

        post: {
            payload: userSyndicationRequestDraftStoreSchemas.actionsPayload.create,
            response: z.object({ id: Identifier.schema })
        },

        update: {
            payload: userSyndicationRequestDraftStoreSchemas.actionsPayload.update.extend({
                photoIdsToBeRemoved: z.array(Identifier.schema),
                id: Identifier.schema
            }),
            response: z.object({})
        }
    }
} satisfies ZodServiceMetadata;

export type UserSyndicationRequestDraftsServiceDTOs = ZodServiceDTOs<
    typeof userSyndicationRequestDraftsServiceMetadata
>;

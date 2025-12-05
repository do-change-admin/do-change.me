import z from 'zod';
import type { ZodCRUDStore, ZodStoreSchemas } from '@/backend/utils/store/store.zod.utils';
import { UserSyndicationRequestDraft } from '@/entities/syndication-request';
import { Identifier } from '@/utils/entities/identifier';

const draftWithMetadata = UserSyndicationRequestDraft.schema
    .omit({
        mainPhotoLink: true,
        additionalPhotoLinks: true
    })
    .extend({
        createdAt: z.date(),
        updatedAt: z.date(),
        mainPhotoId: Identifier.schema.optional(),
        additionalPhotoIds: z.array(Identifier.schema)
    });

export const userSyndicationRequestDraftStoreSchemas = {
    models: {
        list: draftWithMetadata,
        details: draftWithMetadata
    },

    searchPayload: {
        list: draftWithMetadata.pick({ userId: true, make: true, model: true, vin: true }),
        specific: draftWithMetadata.pick({ id: true })
    },

    actionsPayload: {
        create: draftWithMetadata.omit({ id: true, createdAt: true, updatedAt: true }),
        update: draftWithMetadata.omit({ id: true, userId: true, createdAt: true, updatedAt: true }).partial()
    },

    customOperations: {
        filtersData: {
            payload: z.object({ userId: Identifier.schema }),
            response: z.object({ models: z.array(z.string()), makes: z.array(z.string()) })
        }
    }
} satisfies ZodStoreSchemas;

export type UserSyndicationRequestDraftStore = ZodCRUDStore<typeof userSyndicationRequestDraftStoreSchemas>;

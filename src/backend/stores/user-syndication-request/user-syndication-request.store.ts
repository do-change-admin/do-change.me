import z from 'zod';
import type { ZodCRUDStore, ZodStoreSchemas } from '@/backend/utils/store/store.zod.utils';
import { UserSyndicationRequest } from '@/entities/syndication-request';
import { Identifier } from '@/utils/entities/identifier';

const requestWithMetadata = UserSyndicationRequest.schema
    .omit({
        mainPhotoLink: true,
        additionalPhotoLinks: true
    })
    .extend({
        createdAt: z.date(),
        updatedAt: z.date(),
        mainPhotoId: Identifier.schema,
        additionalPhotoIds: z.array(Identifier.schema)
    });

export const userSyndicationRequestStoreSchemas = {
    models: {
        list: requestWithMetadata,
        details: requestWithMetadata
    },
    searchPayload: {
        list: requestWithMetadata
            .pick({
                userId: true,
                status: true,
                make: true,
                model: true,
                vin: true
            })
            .partial(),
        specific: requestWithMetadata.pick({ id: true })
    },
    actionsPayload: {
        create: requestWithMetadata.omit({
            id: true,
            userMail: true,
            status: true,
            marketplaceLinks: true,
            createdAt: true,
            updatedAt: true
        }),
        update: requestWithMetadata
            .pick({
                status: true,
                mainPhotoId: true,
                additionalPhotoIds: true,
                marketplaceLinks: true
            })
            .partial()
    },
    customOperations: {
        filtersData: {
            payload: z.object({ userId: Identifier.schema.optional() }),
            response: z.object({ models: z.array(z.string()), makes: z.array(z.string()) })
        }
    }
} satisfies ZodStoreSchemas;

export type UserSyndicationRequestStore = ZodCRUDStore<typeof userSyndicationRequestStoreSchemas>;

import z from 'zod';
import type { ZodCRUDStore, ZodStoreSchemas } from '@/backend/utils/store/store.zod.utils';
import { Token } from '@/utils/entities/token';

const itemSchema = Token.schema
    .extend({
        id: z.string(),
        userId: z.string()
    })
    .omit({ raw: true });

export const emailVerificationTokenStoreSchemas = {
    models: {
        list: itemSchema,
        details: itemSchema
    },

    searchPayload: {
        list: z.object({}),
        specific: itemSchema.pick({ hash: true }).partial()
    },

    actionsPayload: {
        create: itemSchema.omit({ id: true }),
        update: z.object({})
    }
} satisfies ZodStoreSchemas;

export type EmailVerificationTokenStore = ZodCRUDStore<typeof emailVerificationTokenStoreSchemas>;

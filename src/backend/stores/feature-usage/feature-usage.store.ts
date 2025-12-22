import z from 'zod';
import type { ZodCRUDStore, ZodStoreSchemas } from '@/backend/utils/store/store.zod.utils';
import { Identifier } from '@/utils/entities/identifier';
import { FeatureUsage } from '@/value-objects/feature-usage';

export const featureUsageStoreSchemas = {
    models: {
        list: FeatureUsage.schema,
        details: FeatureUsage.schema
    },

    searchPayload: {
        list: FeatureUsage.schema.omit({ registeredAt: true }).extend({ from: z.date(), to: z.date() }).partial(),
        specific: z.object({ id: Identifier.schema })
    },

    actionsPayload: {
        create: FeatureUsage.schema.omit({ registeredAt: true }),
        update: z.object({})
    }
} satisfies ZodStoreSchemas;

export type FeatureUsageStore = ZodCRUDStore<typeof featureUsageStoreSchemas>;

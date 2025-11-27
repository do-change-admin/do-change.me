import z from 'zod';
import type {
    ZodCRUDStore,
    ZodStoreSchemas
} from '@/backend/utils/store/store.utils.zod';
import { Notification } from '@/value-objects/notification.value-object';

const itemSchema = Notification.modelSchema.extend({
    id: z.string(),
    userId: z.string()
});

export const notificationStoreSchemas = {
    models: {
        list: itemSchema,
        details: itemSchema
    },

    searchPayload: {
        list: itemSchema.pick({ userId: true, seen: true }).partial(),
        specific: itemSchema.pick({ id: true })
    },

    actionsPayload: {
        create: itemSchema.omit({ id: true, seen: true }),
        update: itemSchema.pick({ seen: true, level: true }).partial()
    }
} satisfies ZodStoreSchemas;

export type NotificationStore = ZodCRUDStore<typeof notificationStoreSchemas>;

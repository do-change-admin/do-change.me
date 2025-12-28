import z from 'zod';
import type { ZodCRUDStore, ZodStoreSchemas } from '@/backend/utils/store/store.zod.utils';
import { User } from '@/entities/user';

const userWithMetaData = User.schema.extend({
    createdAt: z.date(),
    updatedAt: z.date(),
    userPlan: User.schema.shape.userPlan.element
        .extend({
            plan: User.schema.shape.userPlan.element.shape.plan.extend({
                createdAt: z.date(),
                updatedAt: z.date()
            }),
            createdAt: z.date(),
            updatedAt: z.date()
        })
        .array()
});

export const userStoreSchemas = {
    models: {
        list: userWithMetaData.omit({ userPlan: true }),
        details: userWithMetaData
    },

    searchPayload: {
        list: z.object({}),
        specific: userWithMetaData.pick({ email: true, id: true }).partial()
    },

    actionsPayload: {
        create: userWithMetaData.pick({
            email: true,
            password: true,
            firstName: true,
            lastName: true,
            emailVerifiedAt: true,
            image: true
        }),
        update: z.object({})
    }
} satisfies ZodStoreSchemas;

export type UserStore = ZodCRUDStore<typeof userStoreSchemas>;

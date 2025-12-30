import z from 'zod';
import { userStoreSchemas } from '@/backend/stores/user/user.store';
import type { ZodServiceDTOs, ZodServiceMetadata } from '@/backend/utils/zod-service.utils';
import { User } from '@/entities/user';

export const userIdentityServiceMetadata = {
    name: 'UserIdentity',
    schemas: {
        register: {
            payload: userStoreSchemas.actionsPayload.create
                .required({ password: true })
                .omit({ emailVerifiedAt: true, image: true }),
            response: User.schema.pick({ id: true })
        },
        authorize: {
            payload: User.schema.pick({ email: true, password: true }).required({ password: true, email: true }),
            response: User.schema.pick({ id: true, email: true })
        },
        oAuthSignIn: {
            payload: User.schema.pick({ email: true, password: true, image: true }).extend({
                name: z.string().optional(),
                provider: z.string().nonempty(),
                providerAccountId: z.string().nonempty()
            }),
            response: User.schema.pick({ email: true, id: true })
        }
    }
} satisfies ZodServiceMetadata;

export type UserIdentityServiceDTOs = ZodServiceDTOs<typeof userIdentityServiceMetadata>;

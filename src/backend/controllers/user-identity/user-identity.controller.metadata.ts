import z from 'zod';
import { userIdentityServiceMetadata } from '@/backend/services/user-identity';
import type { ZodControllerAPI, ZodControllerMetadata } from '@/backend/utils/zod-controller.utils';

export const userIdentityControllerMetadata = {
    name: 'UserIdentify',
    schemas: {
        POST: {
            body: userIdentityServiceMetadata.schemas.register.payload,
            response: z.object({ message: z.string().nonempty() })
        }
    }
} satisfies ZodControllerMetadata;

export type UserIdentityAPI = ZodControllerAPI<typeof userIdentityControllerMetadata>;

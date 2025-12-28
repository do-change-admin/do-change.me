import z from 'zod';
import { userIdentityServiceMetadata } from '@/backend/services/user-identity';
import type { ZodControllerAPI, ZodControllerMetadata } from '@/backend/utils/zod-controller.utils';

export const userIdentifyControllerMetadata = {
    name: 'UserIdentify',
    schemas: {
        POST: {
            body: userIdentityServiceMetadata.schemas.register.payload,
            response: z.object({ message: z.string().nonempty() })
        }
    }
} satisfies ZodControllerMetadata;

export type UserIdentifyAPI = ZodControllerAPI<typeof userIdentifyControllerMetadata>;

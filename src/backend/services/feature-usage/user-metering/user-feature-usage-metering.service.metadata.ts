import z from 'zod';
import type { ZodServiceDTOs, ZodServiceMetadata } from '@/backend/utils/zod-service.utils';
import { Feature } from '@/value-objects/feature';

export const userFeatureUsageMeteringServiceMetadata = {
    name: 'UserFeatureUsageMetering',
    schemas: {
        increment: {
            payload: z.object({ featureName: Feature.nameSchema }),
            response: z.object({})
        }
    }
} satisfies ZodServiceMetadata;

export type UserFeatureUsageMeteringServiceDTOs = ZodServiceDTOs<typeof userFeatureUsageMeteringServiceMetadata>;

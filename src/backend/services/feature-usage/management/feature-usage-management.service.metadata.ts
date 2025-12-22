import z from 'zod';
import type { ZodServiceDTOs, ZodServiceMetadata } from '@/backend/utils/zod-service.utils';
import { Identifier } from '@/utils/entities/identifier';
import { Feature } from '@/value-objects/feature';

export const featureUsageManagementServiceMetadata = {
    name: 'FeatureUsageManagement',
    schemas: {
        /**
         * Получение агреригованных данных по использованию фичей для
         * указанного пользователя. Результат представляет
         */
        getForUser: {
            payload: z.object({ userId: Identifier.schema }),
            response: z.partialRecord(Feature.nameSchema, z.int().nonnegative())
        }
    }
} satisfies ZodServiceMetadata;

export type FeatureUsageManagementServiceDTOs = ZodServiceDTOs<typeof featureUsageManagementServiceMetadata>;

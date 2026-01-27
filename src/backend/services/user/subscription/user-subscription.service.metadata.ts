import z from 'zod';
import type { ZodServiceDTOs, ZodServiceMetadata } from '@/backend/utils/zod-service.utils';
import { Identifier } from '@/utils/entities/identifier';
import { UserFeatureCounters } from '@/value-objects/user-feature-counters';

export const userSubscriptionServiceMetadata = {
    name: 'UserSubscription',
    schemas: {
        /**
         * Каунтеры фич текущего пользователя.
         */
        featureCounters: {
            payload: z.object({}),
            response: UserFeatureCounters.schema
        },

        /**
         * Обнуление каунтера отчётов в начало нового периода подписки у заданного пользователя.
         */
        resetReportsFromSubscription: {
            payload: z.object({ userId: Identifier.schema }),
            response: z.object({})
        },

        /**
         * Использование одного отчёта текущим пользователем.
         */
        useReport: {
            payload: z.object({}),
            response: z.object({
                status: z.enum([
                    'used from cached reports',
                    'used from subscription reports',
                    'used from bought reports',
                    /**
                     * На момент попытки использования отчёта у пользователя не было доступных отчётов.
                     */
                    'no available reports left'
                ])
            })
        },

        /**
         * Добавление отчётов в `boughtReports`.
         */
        buyReports: {
            payload: z.object({ count: z.int().positive() }),
            response: z.object({})
        }
    }
} satisfies ZodServiceMetadata;

export type UserSubscriptionServiceDTOs = ZodServiceDTOs<typeof userSubscriptionServiceMetadata>;

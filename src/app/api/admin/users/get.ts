import z from 'zod';
import { DIContainer } from '@/backend/di-containers';
import { DIServices } from '@/backend/di-containers/tokens.di-container';
import { prismaClient } from '@/backend/infrastructure';
import type { FeatureUsageManagementService } from '@/backend/services/feature-usage/management';
import { FeatureKey } from '@/value-objects/feature-key.vo';
import {
    type ZodAPIMethod,
    type ZodAPISchemas,
    zodApiMethod
} from '../../../../backend/DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';

const schemas = {
    query: undefined,
    body: undefined,
    response: z.object({
        users: z.array(
            z.object({
                id: z.string(),
                email: z.email(),
                downloadedReports: z.number(),
                subscription: z
                    .object({
                        type: z.enum(['auction access', 'basic']),
                        isActive: z.boolean()
                    })
                    .nullable(),
                baseInfoRequests: z.number()
            })
        )
    })
} satisfies ZodAPISchemas;

export type Method = ZodAPIMethod<typeof schemas>;

export const method = zodApiMethod(schemas, {
    handler: async () => {
        // TODO: Обсудить, в списке мы хотим получить данные из связанных таблиц
        const allUsers = await prismaClient.user.findMany({ include: { userPlan: { include: { plan: true } } } });
        const data = await prismaClient.usageAggregate.findMany({
            where: { featureKey: FeatureKey.Report },
            include: { user: true }
        });

        const featureUsageManagementService = DIContainer()._context.get<FeatureUsageManagementService>(
            DIServices.featureUsageManagement
        );

        const baseInfoData: Record<string, number> = {};

        for (const user of allUsers) {
            const baseInfoRequests = await featureUsageManagementService.getForUser({ userId: user.id });
            if (baseInfoRequests['base info']) {
                baseInfoData[user.id] = baseInfoRequests['base info'];
            }
        }

        const usageData = data.reduce(
            (acc, current) => {
                if (!acc[current.userId]) {
                    acc[current.userId] = { email: current.user.email, usage: 0 };
                }

                acc[current.userId].usage += current.usageCount;

                return acc;
            },
            {} as Record<string, { email: string; usage: number }>
        );

        return {
            users: allUsers.map((x) => {
                return {
                    id: x.id,
                    email: x.email,
                    downloadedReports: usageData[x.id]?.usage ?? 0,
                    subscription: x.userPlan?.[0]
                        ? {
                              isActive: x.userPlan?.[0].status === 'active',
                              type: x.userPlan?.[0].plan.slug as any
                          }
                        : null,
                    baseInfoRequests: baseInfoData[x.id] ?? 0
                };
            })
        };
    }
});

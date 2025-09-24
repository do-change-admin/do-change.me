import { FeatureKey } from "@/value-objects/feature-key.vo";
import { prismaClient } from "@/infrastructure/prisma/client";

export class RequestsMeteringService {
    public constructor(private readonly userId: string) { }

    getUsage = async (featureKey: FeatureKey) => {
        const { periodStart, periodEnd } = await this.getCurrentMonthPeriod();

        const data = await prismaClient.usageAggregate.findFirst({
            where: { userId: this.userId, periodEnd, periodStart, featureKey }
        })

        if (!data) {
            return 0
        }

        return data.usageCount
    }

    incrementUsage = async (
        featureKey: FeatureKey,
        amount: number = 1
    ): Promise<void> => {
        const { periodStart, periodEnd } = await this.getCurrentMonthPeriod();

        const aggregate = await prismaClient.usageAggregate.findUnique({
            where: {
                userId_featureKey_periodStart_periodEnd: {
                    userId: this.userId,
                    featureKey,
                    periodStart,
                    periodEnd,
                },
            },
        });

        if (aggregate) {
            await prismaClient.usageAggregate.update({
                where: { id: aggregate.id },
                data: { usageCount: aggregate.usageCount + amount },
            });
        } else {
            await prismaClient.usageAggregate.create({
                data: {
                    userId: this.userId,
                    featureKey,
                    periodStart,
                    periodEnd,
                    usageCount: amount,
                },
            });
        }
    };

    private getCurrentMonthPeriod = async () => {
        const user = await prismaClient.user.findUnique({
            where: { id: this.userId }, include: { userPlan: true }
        })
        const periodStart = user?.userPlan[0].currentPeriodStart ?? new Date()
        const periodEnd = user?.userPlan[0].currentPeriodEnd ?? new Date()
        return { periodStart, periodEnd };
    };
}

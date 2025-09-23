import { FeatureKey } from "@/value-objects/feature-key.vo";
import { User } from "@prisma/client";
import { prismaClient } from "@/infrastructure/prisma/client";

export class RequestsMeteringService {
    public constructor(private readonly userId: string) { }

    incrementUsage = async (
        featureKey: FeatureKey,
        amount: number = 1
    ): Promise<void> => {
        const { periodStart, periodEnd } = this.getCurrentMonthPeriod();

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

    private getCurrentMonthPeriod = () => {
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { periodStart, periodEnd };
    };
}

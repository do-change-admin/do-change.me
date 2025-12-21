import type { Prisma } from '@prisma/client';
import { injectable } from 'inversify';
import { prismaClient as prisma } from '@/backend/infrastructure';
import type { StoreTypes } from '@/backend/utils/store/store.shared-models.utils';
import type { FeatureNameModel } from '@/value-objects/feature';
import type { FeatureUsageStore } from './feature-usage.store';

type Types = StoreTypes<FeatureUsageStore>;

const mappers = {
    toFindOnePayload: (source: Types['findOnePayload']): Prisma.FeatureUsageWhereUniqueInput => {
        return {
            id: source.id
        };
    },
    toFindListPayload: (source: Types['findListPayload']): Prisma.FeatureUsageWhereInput => {
        return {
            userId: source.userId,
            feature: source.featureName,
            registeredAt:
                source.from || source.to
                    ? {
                          lte: source.from,
                          gte: source.to
                      }
                    : undefined
        };
    },
    toListModel: (source: Prisma.FeatureUsageGetPayload<{}>): Types['listModel'] => {
        return {
            featureName: source.feature as FeatureNameModel,
            registeredAt: source.registeredAt,
            userId: source.userId
        };
    },
    toDetails: (source: Prisma.FeatureUsageGetPayload<{ include: {} }>): Types['details'] => {
        return {
            featureName: source.feature as FeatureNameModel,
            registeredAt: source.registeredAt,
            userId: source.userId
        };
    },
    toCreatePayload: (source: Types['createPayload']): Prisma.FeatureUsageCreateInput => {
        return {
            feature: source.featureName,
            user: { connect: { id: source.userId } }
        };
    },
    toUpdatePayload: (_: Types['updatePayload']): Prisma.FeatureUsageUpdateInput => {
        return {};
    }
};

@injectable()
export class FeatureUsagePrismaStore implements FeatureUsageStore {
    list: FeatureUsageStore['list'] = async (payload, { pageSize, zeroBasedIndex }) => {
        const list = await prisma.featureUsage.findMany({
            where: mappers.toFindListPayload(payload),
            skip: zeroBasedIndex * pageSize,
            take: pageSize
        });

        return list.map(mappers.toListModel);
    };

    details: FeatureUsageStore['details'] = async (payload) => {
        const details = await prisma.featureUsage.findUnique({
            where: mappers.toFindOnePayload(payload),
            include: {}
        });

        if (!details) {
            return null;
        }

        return mappers.toDetails(details);
    };

    create: FeatureUsageStore['create'] = async (payload) => {
        const { id } = await prisma.featureUsage.create({
            data: mappers.toCreatePayload(payload),
            select: { id: true }
        });

        return { id };
    };

    updateOne: FeatureUsageStore['updateOne'] = async (searchPayload, updatePayload) => {
        try {
            await prisma.featureUsage.update({
                where: mappers.toFindOnePayload(searchPayload),
                data: mappers.toUpdatePayload(updatePayload)
            });

            return { success: true };
        } catch {
            return { success: false };
        }
    };

    deleteOne: FeatureUsageStore['deleteOne'] = async (searchPayload) => {
        try {
            await prisma.featureUsage.delete({
                where: mappers.toFindOnePayload(searchPayload)
            });

            return { success: true };
        } catch {
            return { success: false };
        }
    };
}

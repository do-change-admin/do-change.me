import type { Prisma } from '@prisma/client';
import { injectable } from 'inversify';
import { prismaClient as prisma } from '@/backend/infrastructure';
import type { StoreTypes } from '@/backend/utils/store/store.utils.shared-models';
import type { NotificationStore } from './notification.store';

type Types = StoreTypes<NotificationStore>;

const mappers = {
    toFindOnePayload: (source: Types['findOnePayload']): Prisma.NotificationWhereUniqueInput => {
        return { id: source.id };
    },
    toFindListPayload: (source: Types['findListPayload']): Prisma.NotificationWhereInput => {
        return { userId: source.userId, seen: source.seen };
    },
    toListModel: (source: Prisma.NotificationGetPayload<{}>): Types['listModel'] => {
        return {
            id: source.id,
            level: source.level,
            message: source.message,
            seen: source.seen,
            title: source.title,
            userId: source.userId
        };
    },
    toDetails: (source: Prisma.NotificationGetPayload<{ include: {} }>): Types['details'] => {
        return {
            id: source.id,
            level: source.level,
            message: source.message,
            seen: source.seen,
            title: source.title,
            userId: source.userId
        };
    },
    toCreatePayload: (source: Types['createPayload']): Prisma.NotificationCreateInput => {
        return { level: source.level, message: source.message, recipient: { connect: { id: source.userId } }, title: source.title };
    },
    toUpdatePayload: (source: Types['updatePayload']): Prisma.NotificationUpdateInput => {
        return { seen: source.seen, level: source.level };
    }
};

@injectable()
export class NotificationPrismaStore implements NotificationStore {
    list: NotificationStore['list'] = async (payload, { pageSize, zeroBasedIndex }) => {
        const list = await prisma.notification.findMany({
            where: mappers.toFindListPayload(payload),
            orderBy: { createdAt: 'desc' },
            skip: zeroBasedIndex * pageSize,
            take: pageSize
        });

        return list.map(mappers.toListModel);
    };

    details: NotificationStore['details'] = async (payload) => {
        const details = await prisma.notification.findUnique({
            where: mappers.toFindOnePayload(payload),
            include: {}
        });

        if (!details) {
            return null;
        }

        return mappers.toDetails(details);
    };

    create: NotificationStore['create'] = async (payload) => {
        const { id } = await prisma.notification.create({
            data: mappers.toCreatePayload(payload),
            select: { id: true }
        });

        return { id };
    };

    updateOne: NotificationStore['updateOne'] = async (searchPayload, updatePayload) => {
        try {
            await prisma.notification.update({
                where: mappers.toFindOnePayload(searchPayload),
                data: mappers.toUpdatePayload(updatePayload)
            });

            return { success: true };
        } catch {
            return { success: false };
        }
    };

    deleteOne: NotificationStore['deleteOne'] = async (searchPayload) => {
        try {
            await prisma.notification.delete({
                where: mappers.toFindOnePayload(searchPayload)
            });

            return { success: true };
        } catch {
            return { success: false };
        }
    };
}

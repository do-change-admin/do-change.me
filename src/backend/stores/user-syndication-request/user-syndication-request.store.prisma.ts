import type { Prisma } from '@prisma/client';
import { injectable } from 'inversify';
import { prismaClient as prisma } from '@/backend/infrastructure';
import type { StoreTypes } from '@/backend/utils/store/store.shared-models.utils';
import type { SyndicationRequestStatus } from '@/entities/syndication-request';
import type { UserSyndicationRequestStore } from './user-syndication-request.store';

type Types = StoreTypes<UserSyndicationRequestStore>;

const mappers = {
    toFindOnePayload: ({ id }: Types['findOnePayload']): Prisma.UserSyndicationRequestWhereUniqueInput => {
        return {
            id
        };
    },
    toFindListPayload: ({
        make,
        model,
        status,
        userId,
        vin
    }: Types['findListPayload']): Prisma.UserSyndicationRequestWhereInput => {
        return {
            make,
            model,
            status,
            userId,
            vin
        };
    },
    toListModel: ({
        additionalPhotoIds,
        createdAt,
        id,
        mainPhotoId,
        make,
        marketplaceLinks,
        updatedAt,
        user,
        mileage,
        model,
        price,
        status,
        userId,
        vin,
        year
    }: Prisma.UserSyndicationRequestGetPayload<{ include: { user: true } }>): Types['listModel'] => {
        return {
            additionalPhotoIds,
            createdAt,
            id,
            mainPhotoId,
            make,
            marketplaceLinks,
            mileage,
            model,
            price,
            status: status as Types['listModel']['status'],
            updatedAt,
            userId,
            userMail: user.email,
            vin,
            year
        };
    },
    toDetails: ({
        additionalPhotoIds,
        createdAt,
        id,
        mainPhotoId,
        make,
        marketplaceLinks,
        updatedAt,
        user,
        mileage,
        model,
        price,
        status,
        userId,
        vin,
        year
    }: Prisma.UserSyndicationRequestGetPayload<{ include: { user: true } }>): Types['listModel'] => {
        return {
            additionalPhotoIds,
            createdAt,
            id,
            mainPhotoId,
            make,
            marketplaceLinks,
            mileage,
            model,
            price,
            status: status as Types['listModel']['status'],
            updatedAt,
            userId,
            userMail: user.email,
            vin,
            year
        };
    },
    toCreatePayload: ({
        additionalPhotoIds,
        mainPhotoId,
        make,
        mileage,
        model,
        price,
        userId,
        vin,
        year
    }: Types['createPayload']): Prisma.UserSyndicationRequestCreateInput => {
        const initialStatus: SyndicationRequestStatus = 'pending publisher';
        return {
            additionalPhotoIds,
            mainPhotoId,
            make,
            mileage,
            model,
            price,
            user: { connect: { id: userId } },
            vin,
            year,
            status: initialStatus
        };
    },
    toUpdatePayload: ({
        status,
        additionalPhotoIds,
        mainPhotoId,
        marketplaceLinks
    }: Types['updatePayload']): Prisma.UserSyndicationRequestUpdateInput => {
        return {
            status,
            additionalPhotoIds: additionalPhotoIds ? { set: additionalPhotoIds } : undefined,
            mainPhotoId,
            marketplaceLinks: marketplaceLinks ? { set: marketplaceLinks } : undefined
        };
    }
};

@injectable()
export class UserSyndicationRequestPrismaStore implements UserSyndicationRequestStore {
    list: UserSyndicationRequestStore['list'] = async (payload, { pageSize, zeroBasedIndex }) => {
        const list = await prisma.userSyndicationRequest.findMany({
            where: mappers.toFindListPayload(payload),
            skip: zeroBasedIndex * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        });

        return list.map(mappers.toListModel);
    };

    details: UserSyndicationRequestStore['details'] = async (payload) => {
        const details = await prisma.userSyndicationRequest.findUnique({
            where: mappers.toFindOnePayload(payload),
            include: { user: true }
        });

        if (!details) {
            return null;
        }

        return mappers.toDetails(details);
    };

    create: UserSyndicationRequestStore['create'] = async (payload) => {
        const { id } = await prisma.userSyndicationRequest.create({
            data: mappers.toCreatePayload(payload),
            select: { id: true }
        });

        return { id };
    };

    updateOne: UserSyndicationRequestStore['updateOne'] = async (searchPayload, updatePayload) => {
        try {
            await prisma.userSyndicationRequest.update({
                where: mappers.toFindOnePayload(searchPayload),
                data: mappers.toUpdatePayload(updatePayload)
            });

            return { success: true };
        } catch {
            return { success: false };
        }
    };

    deleteOne: UserSyndicationRequestStore['deleteOne'] = async (searchPayload) => {
        try {
            await prisma.userSyndicationRequest.delete({
                where: mappers.toFindOnePayload(searchPayload)
            });

            return { success: true };
        } catch {
            return { success: false };
        }
    };

    filtersData: UserSyndicationRequestStore['filtersData'] = async ({ userId }) => {
        const data = await prisma.userSyndicationRequest.findMany({
            select: { make: true, model: true },
            where: { userId },
            distinct: ['make', 'model']
        });

        return {
            makes: [...new Set(data.map((x) => x.make))],
            models: [...new Set(data.map((x) => x.model))]
        };
    };
}

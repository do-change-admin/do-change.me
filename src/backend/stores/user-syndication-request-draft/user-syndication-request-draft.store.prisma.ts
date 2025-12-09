import type { Prisma } from '@prisma/client';
import { injectable } from 'inversify';
import { prismaClient as prisma } from '@/backend/infrastructure';
import type { StoreTypes } from '@/backend/utils/store/store.shared-models.utils';
import type { UserSyndicationRequestDraftStore } from './user-syndication-request-draft.store';

type Types = StoreTypes<UserSyndicationRequestDraftStore>;

const mappers = {
    toFindOnePayload: ({ id }: Types['findOnePayload']): Prisma.UserSyndicationRequestDraftWhereUniqueInput => {
        return { id };
    },
    toFindListPayload: ({
        userId,
        make,
        model,
        vin
    }: Types['findListPayload']): Prisma.UserSyndicationRequestDraftWhereInput => {
        return { userId, make, model, vin };
    },
    toListModel: ({
        additionalPhotoIds,
        createdAt,
        id,
        mainPhotoId,
        make,
        mileage,
        model,
        price,
        updatedAt,
        userId,
        vin,
        year
    }: Prisma.UserSyndicationRequestDraftGetPayload<{}>): Types['listModel'] => {
        return {
            additionalPhotoIds,
            createdAt,
            id,
            mainPhotoId: mainPhotoId ?? undefined,
            make: make ?? undefined,
            mileage: mileage ?? undefined,
            model: model ?? undefined,
            price: price ?? undefined,
            updatedAt,
            userId,
            vin: vin ?? undefined,
            year: year ?? undefined
        };
    },
    toDetails: ({
        additionalPhotoIds,
        createdAt,
        id,
        mainPhotoId,
        make,
        mileage,
        model,
        price,
        updatedAt,
        userId,
        vin,
        year
    }: Prisma.UserSyndicationRequestDraftGetPayload<{ include: {} }>): Types['details'] => {
        return {
            additionalPhotoIds,
            createdAt,
            id,
            mainPhotoId: mainPhotoId ?? undefined,
            make: make ?? undefined,
            mileage: mileage ?? undefined,
            model: model ?? undefined,
            price: price ?? undefined,
            updatedAt,
            userId,
            vin: vin ?? undefined,
            year: year ?? undefined
        };
    },
    toCreatePayload: ({
        additionalPhotoIds,
        userId,
        mainPhotoId,
        make,
        mileage,
        model,
        price,
        vin,
        year
    }: Types['createPayload']): Prisma.UserSyndicationRequestDraftCreateInput => {
        return {
            additionalPhotoIds,
            user: { connect: { id: userId } },
            mainPhotoId,
            make,
            mileage,
            model,
            price,
            vin,
            year
        };
    },
    toUpdatePayload: ({
        additionalPhotoIds,
        mainPhotoId,
        make,
        mileage,
        model,
        price,
        vin,
        year
    }: Types['updatePayload']): Prisma.UserSyndicationRequestDraftUpdateInput => {
        return {
            additionalPhotoIds: additionalPhotoIds ? { set: additionalPhotoIds } : undefined,
            mainPhotoId,
            make,
            mileage,
            model,
            price,
            vin,
            year
        };
    }
};

@injectable()
export class UserSyndicationRequestDraftPrismaStore implements UserSyndicationRequestDraftStore {
    list: UserSyndicationRequestDraftStore['list'] = async (payload, { pageSize, zeroBasedIndex }) => {
        const list = await prisma.userSyndicationRequestDraft.findMany({
            where: mappers.toFindListPayload(payload),
            skip: zeroBasedIndex * pageSize,
            take: pageSize,
            orderBy: { updatedAt: 'desc' }
        });

        return list.map(mappers.toListModel);
    };

    details: UserSyndicationRequestDraftStore['details'] = async (payload) => {
        const details = await prisma.userSyndicationRequestDraft.findUnique({
            where: mappers.toFindOnePayload(payload),
            include: {}
        });

        if (!details) {
            return null;
        }

        return mappers.toDetails(details);
    };

    create: UserSyndicationRequestDraftStore['create'] = async (payload) => {
        const { id } = await prisma.userSyndicationRequestDraft.create({
            data: mappers.toCreatePayload(payload),
            select: { id: true }
        });

        return { id };
    };

    updateOne: UserSyndicationRequestDraftStore['updateOne'] = async (searchPayload, updatePayload) => {
        try {
            await prisma.userSyndicationRequestDraft.update({
                where: mappers.toFindOnePayload(searchPayload),
                data: mappers.toUpdatePayload(updatePayload)
            });

            return { success: true };
        } catch {
            return { success: false };
        }
    };

    deleteOne: UserSyndicationRequestDraftStore['deleteOne'] = async (searchPayload) => {
        try {
            await prisma.userSyndicationRequestDraft.delete({
                where: mappers.toFindOnePayload(searchPayload)
            });

            return { success: true };
        } catch {
            return { success: false };
        }
    };

    filtersData: UserSyndicationRequestDraftStore['filtersData'] = async ({ userId }) => {
        const data = await prisma.userSyndicationRequestDraft.findMany({
            select: { make: true, model: true },
            where: { userId },
            distinct: ['make', 'model']
        });

        return {
            makes: [...new Set(data.map((x) => x.make).filter((x) => typeof x === 'string'))],
            models: [...new Set(data.map((x) => x.model).filter((x) => typeof x === 'string'))]
        };
    };
}

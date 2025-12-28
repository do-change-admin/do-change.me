import type { Prisma } from '@prisma/client';
import { injectable } from 'inversify';
import { prismaClient as prisma } from '@/backend/infrastructure';
import type { StoreTypes } from '@/backend/utils/store/store.shared-models.utils';
import type { UserStore } from './user.store';

type Types = StoreTypes<UserStore>;

const mappers = {
    toFindOnePayload: ({ email, id }: Types['findOnePayload']): Prisma.UserWhereUniqueInput => {
        return { email, id };
    },
    toFindListPayload: (_source: Types['findListPayload']): Prisma.UserWhereInput => {
        return {};
    },
    toListModel: ({
        address,
        auctionAccessNumber,
        auctionAccessQRFileId,
        bio,
        birthDate,
        createdAt,
        email,
        emailVerifiedAt,
        firstName,
        id,
        image,
        lastName,
        password,
        phone,
        photoFileId,
        state,
        updatedAt,
        zipCode
    }: Prisma.UserGetPayload<{}>): Types['listModel'] => {
        return {
            createdAt: createdAt,
            email: email,
            id: id,
            updatedAt: updatedAt,
            address: address ?? undefined,
            auctionAccessNumber: auctionAccessNumber ?? undefined,
            auctionAccessQRFileId: auctionAccessQRFileId ?? undefined,
            bio: bio ?? undefined,
            birthDate: birthDate ?? undefined,
            emailVerifiedAt: emailVerifiedAt ?? undefined,
            firstName: firstName ?? undefined,
            image: image ?? undefined,
            lastName: lastName ?? undefined,
            password: password ?? undefined,
            phone: phone ?? undefined,
            photoFileId: photoFileId ?? undefined,
            state: state ?? undefined,
            zipCode: zipCode ?? undefined
        };
    },
    toDetails: ({
        address,
        auctionAccessNumber,
        auctionAccessQRFileId,
        bio,
        birthDate,
        createdAt,
        email,
        emailVerifiedAt,
        firstName,
        id,
        image,
        lastName,
        password,
        phone,
        photoFileId,
        state,
        updatedAt,
        userPlan,
        zipCode
    }: Prisma.UserGetPayload<{
        include: { userPlan: { include: { plan: true; price: true } } };
    }>): Types['details'] => {
        return {
            createdAt: createdAt,
            email: email,
            id: id,
            updatedAt: updatedAt,
            userPlan: userPlan.map(
                ({
                    cancelAtPeriodEnd,
                    canceledAt,
                    createdAt,
                    currentPeriodEnd,
                    currentPeriodStart,
                    id,
                    plan,
                    price,
                    status,
                    stripeSubscriptionId,
                    updatedAt
                }) => ({
                    id: id,
                    cancelAtPeriodEnd: cancelAtPeriodEnd,
                    currentPeriodEnd: currentPeriodEnd,
                    currentPeriodStart: currentPeriodStart,
                    createdAt,
                    updatedAt,
                    stripeSubscriptionId,
                    plan: {
                        id: plan.id,
                        slug: plan.slug,
                        active: plan.active,
                        createdAt: plan.createdAt,
                        name: plan.name,
                        reportsCount: plan.reportsCount,
                        stripeProductId: plan.stripeProductId,
                        updatedAt: plan.updatedAt,
                        description: plan.description ?? undefined
                    },
                    status: status,
                    canceledAt: canceledAt ?? undefined,
                    planPrice: {
                        amount: price.amount,
                        currency: price.currency,
                        id: price.id,
                        interval: price.interval,
                        planId: price.planId,
                        slug: price.slug,
                        stripePriceId: price.stripePriceId
                    }
                })
            ),
            address: address ?? undefined,
            auctionAccessNumber: auctionAccessNumber ?? undefined,
            auctionAccessQRFileId: auctionAccessQRFileId ?? undefined,
            bio: bio ?? undefined,
            birthDate: birthDate ?? undefined,
            emailVerifiedAt: emailVerifiedAt ?? undefined,
            firstName: firstName ?? undefined,
            image: image ?? undefined,
            lastName: lastName ?? undefined,
            password: password ?? undefined,
            phone: phone ?? undefined,
            photoFileId: photoFileId ?? undefined,
            state: state ?? undefined,
            zipCode: zipCode ?? undefined
        };
    },
    toCreatePayload: ({
        email,
        emailVerifiedAt,
        firstName,
        image,
        lastName,
        password
    }: Types['createPayload']): Prisma.UserCreateInput => {
        return { email, emailVerifiedAt, firstName, image, lastName, password };
    },
    toUpdatePayload: (_source: Types['updatePayload']): Prisma.UserUpdateInput => {
        return {};
    }
};

@injectable()
export class UserPrismaStore implements UserStore {
    list: UserStore['list'] = async (payload, { pageSize, zeroBasedIndex }) => {
        const list = await prisma.user.findMany({
            where: mappers.toFindListPayload(payload),
            skip: zeroBasedIndex * pageSize,
            take: pageSize
        });

        return list.map(mappers.toListModel);
    };

    details: UserStore['details'] = async (payload) => {
        const details = await prisma.user.findUnique({
            where: mappers.toFindOnePayload(payload),
            include: { userPlan: { include: { plan: true, price: true } } }
        });

        if (!details) {
            return null;
        }

        return mappers.toDetails(details);
    };

    create: UserStore['create'] = async (payload) => {
        const { id } = await prisma.user.create({
            data: mappers.toCreatePayload(payload),
            select: { id: true }
        });

        return { id };
    };

    updateOne: UserStore['updateOne'] = async (searchPayload, updatePayload) => {
        try {
            await prisma.user.update({
                where: mappers.toFindOnePayload(searchPayload),
                data: mappers.toUpdatePayload(updatePayload)
            });

            return { success: true };
        } catch {
            return { success: false };
        }
    };

    deleteOne: UserStore['deleteOne'] = async (searchPayload) => {
        try {
            await prisma.user.delete({
                where: mappers.toFindOnePayload(searchPayload)
            });

            return { success: true };
        } catch {
            return { success: false };
        }
    };
}

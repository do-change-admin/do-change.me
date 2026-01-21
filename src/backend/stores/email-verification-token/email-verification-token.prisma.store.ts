import type { Prisma } from '@prisma/client';
import { injectable } from 'inversify';
import { prismaClient as prisma } from '@/backend/infrastructure';
import type { StoreTypes } from '@/backend/utils/store/store.shared-models.utils';
import type { EmailVerificationTokenStore } from './email-verification-token.store';

type Types = StoreTypes<EmailVerificationTokenStore>;

const mappers = {
    toFindOnePayload: (source: Types['findOnePayload']): Prisma.EmailVerificationTokenWhereUniqueInput => {
        return { tokenHash: source.hash };
    },
    toFindListPayload: (_: Types['findListPayload']): Prisma.EmailVerificationTokenWhereInput => {
        return {};
    },
    toListModel: (source: Prisma.EmailVerificationTokenGetPayload<{}>): Types['listModel'] => {
        return {
            id: source.id,
            expiresAt: source.expiresAt,
            hash: source.tokenHash,
            userId: source.userId
        };
    },
    toDetails: (source: Prisma.EmailVerificationTokenGetPayload<{ include: {} }>): Types['details'] => {
        return {
            id: source.id,
            expiresAt: source.expiresAt,
            hash: source.tokenHash,
            userId: source.userId
        };
    },
    toCreatePayload: (source: Types['createPayload']): Prisma.EmailVerificationTokenCreateInput => {
        return {
            expiresAt: source.expiresAt,
            tokenHash: source.hash,
            user: { connect: { id: source.userId } }
        };
    },
    toUpdatePayload: (_: Types['updatePayload']): Prisma.EmailVerificationTokenUpdateInput => {
        return {};
    }
};

@injectable()
export class EmailVerificationTokenPrismaStore implements EmailVerificationTokenStore {
    list: EmailVerificationTokenStore['list'] = async (payload, { pageSize, zeroBasedIndex }) => {
        const list = await prisma.emailVerificationToken.findMany({
            where: mappers.toFindListPayload(payload),
            skip: zeroBasedIndex * pageSize,
            take: pageSize
        });

        return list.map(mappers.toListModel);
    };

    details: EmailVerificationTokenStore['details'] = async (payload) => {
        const details = await prisma.emailVerificationToken.findUnique({
            where: mappers.toFindOnePayload(payload),
            include: {}
        });

        if (!details) {
            return null;
        }

        return mappers.toDetails(details);
    };

    create: EmailVerificationTokenStore['create'] = async (payload) => {
        const { id } = await prisma.emailVerificationToken.create({
            data: mappers.toCreatePayload(payload),
            select: { id: true }
        });

        return { id };
    };

    updateOne: EmailVerificationTokenStore['updateOne'] = async (searchPayload, updatePayload) => {
        try {
            await prisma.emailVerificationToken.update({
                where: mappers.toFindOnePayload(searchPayload),
                data: mappers.toUpdatePayload(updatePayload)
            });

            return { success: true };
        } catch {
            return { success: false };
        }
    };

    deleteOne: EmailVerificationTokenStore['deleteOne'] = async (searchPayload) => {
        try {
            await prisma.emailVerificationToken.delete({
                where: mappers.toFindOnePayload(searchPayload)
            });

            return { success: true };
        } catch {
            return { success: false };
        }
    };
}

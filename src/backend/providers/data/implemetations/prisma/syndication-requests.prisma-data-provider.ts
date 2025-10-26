import { Interface, ListModel, Details, FindOnePayload, FindListPayload, CreatePayload, UpdatePayload, FilterModels } from '../../contracts/syndication-requests.data-provider'
import { prismaClient } from '@/backend/infrastructure';
import { Prisma } from '@prisma/client'
import type { SyndicationRequestActiveStatusNames } from '@/entities/sindycation-request-status.entity';

const mappers = {
    toFindOnePayload: (source: FindOnePayload): Prisma.SyndicationRequestsWhereUniqueInput => {
        return {
            id: source.id,
            userId: source.userId
        };
    },
    toFindListPayload: (source: FindListPayload): Prisma.SyndicationRequestsWhereInput => {
        return {
            userId: source.userId,
            status: source.status,
            make: source.make ? { contains: source.make, mode: 'insensitive' } : undefined,
            model: source.model ? { contains: source.model, mode: 'insensitive' } : undefined,
            vin: source.vin ? { contains: source.vin, mode: 'insensitive' } : undefined
        };
    },
    toListModel: (source: Prisma.SyndicationRequestsGetPayload<{ include: { user: true } }>): ListModel => {
        return {
            id: source.id,
            make: source.make,
            marketplaceLinks: source.marketplaceLinks,
            mileage: source.mileage,
            model: source.model,
            photoIds: source.photoIds,
            price: source.price,
            status: source.status as SyndicationRequestActiveStatusNames,
            userId: source.user.id,
            userMail: source.user.email,
            vin: source.vin,
            year: source.year
        };
    },
    toDetails: (source: Prisma.SyndicationRequestsGetPayload<{ include: { user: true } }>): Details => {
        return {
            id: source.id,
            make: source.make,
            marketplaceLinks: source.marketplaceLinks,
            mileage: source.mileage,
            model: source.model,
            photoIds: source.photoIds,
            price: source.price,
            status: source.status as SyndicationRequestActiveStatusNames,
            userId: source.user.id,
            userMail: source.user.email,
            vin: source.vin,
            year: source.year

        };
    },
    toCreatePayload: (source: CreatePayload): Prisma.SyndicationRequestsCreateInput => {
        return {
            user: {
                connect: {
                    id: source.userId
                }
            },
            make: source.make,
            mileage: source.mileage,
            model: source.model,
            price: source.price,
            status: "pending publisher" satisfies SyndicationRequestActiveStatusNames,
            vin: source.vin,
            year: source.year,
            photoIds: source.photoIds
        };
    },
    toUpdatePayload: (source: UpdatePayload): Prisma.SyndicationRequestsUpdateInput => {
        return {
            status: source.status,
            marketplaceLinks: {
                set: source.marketplaceLinks
            }
        };
    }
}
export class SyndicationRequests implements Interface {
    list: Interface['list'] = async (payload, { pageSize, zeroBasedIndex }) => {
        const list = await prismaClient.syndicationRequests.findMany({
            where: mappers.toFindListPayload(payload),
            skip: zeroBasedIndex * pageSize,
            take: pageSize,
            include: { user: true }
        })

        return list.map(mappers.toListModel)
    };

    details: Interface['details'] = async (payload) => {
        const details = await prismaClient.syndicationRequests.findUnique({
            where: mappers.toFindOnePayload(payload),
            include: { user: true }
        })

        if (!details) {
            return null
        }

        return mappers.toDetails(details)
    };

    create: Interface['create'] = async (payload) => {
        const { id } = await prismaClient.syndicationRequests.create({
            data: mappers.toCreatePayload(payload),
            select: { id: true }
        })

        return { id }
    };

    updateOne: Interface['updateOne'] = async (searchPayload, updatePayload) => {
        try {
            await prismaClient.syndicationRequests.update({
                where: mappers.toFindOnePayload(searchPayload),
                data: mappers.toUpdatePayload(updatePayload),
            })

            return { success: true }
        }
        catch {
            return { success: false }
        }
    };

    deleteOne: Interface['deleteOne'] = async (searchPayload) => {
        try {
            await prismaClient.syndicationRequests.delete({
                where: mappers.toFindOnePayload(searchPayload),
            })

            return { success: true }
        }
        catch {
            return { success: false }
        }
    };

    filtersData: Interface['filtersData'] = async (userId) => {
        const data = await prismaClient.syndicationRequests.findMany({
            select: { make: true, model: true },
            where: { userId },
            distinct: ['make', 'model']
        })

        return {
            makes: data.map(x => x.make),
            models: data.map(x => x.model)
        }
    }
};
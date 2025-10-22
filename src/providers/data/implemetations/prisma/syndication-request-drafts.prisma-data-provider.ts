import { prismaClient } from '@/infrastructure'
import { Interface, ListModel, Details, FindOnePayload, FindListPayload, CreatePayload, UpdatePayload, FilterModels } from '../../contracts/syndication-request-drafts.data-provider'
import { Prisma } from '@prisma/client'

const mappers = {
    toFindOnePayload: (source: FindOnePayload): Prisma.SyndicationRequestDraftsWhereUniqueInput => {
        return {
            id: source.id,
            userId: source.userId
        };
    },
    toFindListPayload: (source: FindListPayload): Prisma.SyndicationRequestDraftsWhereInput => {
        return {
            userId: source.userId,
            make: source.make ? { contains: source.make, mode: 'insensitive' } : undefined,
            model: source.model ? { contains: source.model, mode: 'insensitive' } : undefined,
            vin: source.vin ? { contains: source.vin, mode: 'insensitive' } : undefined
        };
    },
    toListModel: (source: Prisma.SyndicationRequestDraftsGetPayload<{}>): ListModel => {
        return {
            id: source.id,
            userId: source.userId,
            make: source.make || undefined,
            mileage: source.mileage || undefined,
            model: source.model || undefined,
            photoIds: source.photoIds,
            price: source.price || undefined,
            vin: source.vin || undefined,
            year: source.year || undefined
        };
    },
    toDetails: (source: Prisma.SyndicationRequestDraftsGetPayload<{ include: {} }>): Details => {
        return {
            id: source.id,
            userId: source.userId,
            make: source.make || undefined,
            mileage: source.mileage || undefined,
            model: source.model || undefined,
            photoIds: source.photoIds,
            price: source.price || undefined,
            vin: source.vin || undefined,
            year: source.year || undefined
        };
    },
    toCreatePayload: (source: CreatePayload): Prisma.SyndicationRequestDraftsCreateInput => {
        return {
            user: {
                connect: {
                    id: source.userId
                }
            },
            make: source.make,
            mileage: source.mileage,
            model: source.model,
            photoIds: source.photoIds,
            price: source.price,
            vin: source.vin,
            year: source.year
        };
    },
    toUpdatePayload: (source: UpdatePayload): Prisma.SyndicationRequestDraftsUpdateInput => {
        return {
            make: source.make,
            mileage: source.mileage,
            model: source.model,
            photoIds: source.photoIds ? {
                set: source.photoIds
            } : undefined,
            price: source.price,
            vin: source.vin,
            year: source.year
        };
    }
}
export class SyndicationRequestDrafts implements Interface {
    list: Interface['list'] = async (payload, { pageSize, zeroBasedIndex }) => {
        const list = await prismaClient.syndicationRequestDrafts.findMany({
            where: mappers.toFindListPayload(payload),
            skip: zeroBasedIndex * pageSize,
            take: pageSize
        })

        return list.map(mappers.toListModel)
    };

    details: Interface['details'] = async (payload) => {
        const details = await prismaClient.syndicationRequestDrafts.findUnique({
            where: mappers.toFindOnePayload(payload),
            include: {}
        })

        if (!details) {
            return null
        }

        return mappers.toDetails(details)
    };

    create: Interface['create'] = async (payload) => {
        const { id } = await prismaClient.syndicationRequestDrafts.create({
            data: mappers.toCreatePayload(payload),
            select: { id: true }
        })

        return { id }
    };

    updateOne: Interface['updateOne'] = async (searchPayload, updatePayload) => {
        try {
            await prismaClient.syndicationRequestDrafts.update({
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
            await prismaClient.syndicationRequestDrafts.delete({
                where: mappers.toFindOnePayload(searchPayload),
            })

            return { success: true }
        }
        catch {
            return { success: false }
        }
    };

    filtersData: Interface['filtersData'] = async (userId) => {
        const data = await prismaClient.syndicationRequestDrafts.findMany({
            select: { make: true, model: true },
            distinct: ['make', 'model']
        })

        return {
            makes: data.filter(x => typeof x.make === 'string').map(x => x.make) as string[],
            models: data.filter(x => typeof x.model === 'string').map(x => x.model) as string[]
        }
    };

};
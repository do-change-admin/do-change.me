import { PaginationSchemaType } from "@/schemas";
import { AdminUpdateAuctionAccessRequest, AuctionAccessRequestCountByStages, AuctionAccessRequestFullItem, AuctionAccessRequestListItem, AuctionAccessRequestStatus } from './types'
import { prismaClient } from "@/infrastructure";
import { businessError } from "@/lib/errors";
import { ProvidesFileLink } from "@/providers/contracts";

type FindListQueryData = PaginationSchemaType & { status: AuctionAccessRequestStatus }

export class AuctionAccessRequestsAdminService {
    public constructor(private readonly fileLinksProvider: ProvidesFileLink) {

    }

    count = async (): Promise<AuctionAccessRequestCountByStages> => {
        const review = await prismaClient.auctionAccessRequest.count({
            where: {
                status: { in: ['review'] }
            }
        })

        const scheduling = await prismaClient.auctionAccessRequest.count({
            where: {
                status: {
                    in: ['awaiting user confirmation', 'call scheduling', 'call completed']
                }
            }
        })

        const onboarding = await prismaClient.auctionAccessRequest.count({
            where: {
                status: {
                    in: [
                        'awaiting documents upload',
                        'documents under review',
                        'corrections required',
                        'ready for auction access'
                    ]
                }
            }
        })

        const approved = await prismaClient.auctionAccessRequest.count({
            where: {
                status: {
                    in: [
                        'approved'
                    ]
                }
            }
        })

        const rejected = await prismaClient.auctionAccessRequest.count({
            where: {
                status: {
                    in: [
                        'rejected'
                    ]
                }
            }
        })


        return {
            review,
            scheduling,
            onboarding,
            approved,
            rejected
        }
    }

    setStatus = async (id: string, status: AuctionAccessRequestStatus) => {
        await prismaClient.auctionAccessRequest.update({
            where: { id },
            data: { status }
        })
    }

    detailedItem = async (id: string): Promise<AuctionAccessRequestFullItem> => {
        const result = await prismaClient.auctionAccessRequest.findUnique({
            where: { id },
            include: { activeSlot: true, timeSlots: true }
        })

        if (!result) {
            throw businessError('No request was found with according id')
        }

        let agreementLink = null
        let driverLicenseLink = null

        if (result.agreementFileId) {
            agreementLink = await this.fileLinksProvider.obtainDownloadLink(result.agreementFileId)
        }

        if (result.driverLicenceFileId) {
            driverLicenseLink = await this.fileLinksProvider.obtainDownloadLink(result.driverLicenceFileId)
        }

        return {
            applicationDate: result.applicationDate,
            birthDate: result.birthDate,
            email: result.email,
            firstName: result.firstName,
            id: result.id,
            lastName: result.lastName,
            photoLink: result.photoLink,
            status: result.status as AuctionAccessRequestStatus,
            timeSlots: result.timeSlots,
            activeTimeSlot: result.activeSlot || null,
            links: {
                agreement: agreementLink,
                driverLicence: driverLicenseLink
            },
            auctionAccessNumber: result.auctionAccessNumber ?? undefined,
            bio: result.bio
        }
    }

    findRequests = async (query: FindListQueryData): Promise<AuctionAccessRequestListItem[]> => {
        const result = await prismaClient.auctionAccessRequest.findMany({
            skip: query.skip,
            take: query.take,
            where: {
                status: query.status
            }
        })

        return result.map((dbItem) => {
            return {
                applicationDate: dbItem.applicationDate,
                birthDate: dbItem.birthDate,
                email: dbItem.email,
                firstName: dbItem.firstName,
                id: dbItem.id,
                lastName: dbItem.lastName,
                photoLink: dbItem.photoLink,
                status: dbItem.status as AuctionAccessRequestStatus,
            }
        })
    }

    update = async (payload: AdminUpdateAuctionAccessRequest) => {
        const accordingRequest = await prismaClient.auctionAccessRequest.findUnique({ where: { id: payload.id } })
        if (!accordingRequest) {
            throw businessError('No according request was found')
        }

        const steps: Partial<Record<AuctionAccessRequestStatus, AuctionAccessRequestStatus>> = {
            'review': 'awaiting user confirmation',
            'awaiting user confirmation': 'call scheduling',
            'call scheduling': 'call completed',
            'call completed': 'awaiting documents upload',
            'awaiting documents upload': 'documents under review',
            'documents under review': 'corrections required',
            'corrections required': 'ready for auction access',
            'ready for auction access': 'approved'
        }

        await prismaClient.auctionAccessRequest.update({
            where: { id: payload.id },
            data: {
                timeSlots: payload.availableTimeSlots ? {
                    createMany: {
                        data: payload.availableTimeSlots
                    }
                } : undefined,
                status: payload.progress ? payload.progress === 'next approve step' ? steps[accordingRequest.status as AuctionAccessRequestStatus] || 'approved' : 'rejected' : undefined
            },
        })
    }
}
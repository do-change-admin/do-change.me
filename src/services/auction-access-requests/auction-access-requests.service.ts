import { PaginationSchemaType } from "@/schemas";
import { AdminUpdateAuctionAccessRequest, AuctionAccessRequestFullItem, AuctionAccessRequestListItem, AuctionAccessRequestStatus, UpdateAuctionAccessRequest } from './types'
import { prismaClient } from "@/infrastructure";
import { ProfileService } from "../profile";
import { EmailAddress } from "@/value-objects/email-address.vo";
import { businessError } from "@/lib/errors";

type FindListQueryData = PaginationSchemaType & { status: AuctionAccessRequestStatus }

export class AuctionAccessRequestsService {
    detailedItemForAdmin = async (id: string): Promise<AuctionAccessRequestFullItem> => {
        const result = await prismaClient.auctionAccessRequest.findUnique({
            where: { id },
            include: { activeSlot: true, timeSlots: true }
        })

        if (!result) {
            throw businessError('No request was found with according id')
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
            activeTimeSlot: result.activeSlot || null
        }
    }

    findRequestsForAdmin = async (query: FindListQueryData): Promise<AuctionAccessRequestListItem[]> => {
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

    create = async (rawEmail: string) => {
        const email = EmailAddress.create(rawEmail)
        const profileService = new ProfileService(email)
        const profileData = await profileService.profileData()
        await prismaClient.auctionAccessRequest.create({
            data: {
                applicationDate: new Date(),
                email: email.address(),
                firstName: profileData.firstName,
                // TODO
                birthDate: new Date(1990, 2, 4),
                lastName: profileData.lastName,
                status: 'review',
                // TODO
                photoLink: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
            }
        })
    }

    adminUpdate = async (payload: AdminUpdateAuctionAccessRequest) => {
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

    update = async (payload: UpdateAuctionAccessRequest) => {
        const foundRequest = await prismaClient.auctionAccessRequest.findFirst({ where: { email: payload.userMail } })
        if (!foundRequest) {
            throw businessError('No according request was found')
        }

        if (!['awaiting documents upload', 'awaiting user confirmation'].includes(foundRequest.status)) {
            throw businessError('Request is in admin awaiting status')
        }

        if (foundRequest.status === 'awaiting user confirmation' && !payload.selectedTimeSlotId) {
            throw businessError('No time slot was selected')
        }

        await prismaClient.auctionAccessRequest.updateMany({
            // TODO - make email unique
            where: { email: payload.userMail },
            data: {
                activeSlotId: payload.selectedTimeSlotId ?? undefined,
                status: foundRequest.status === 'awaiting documents upload' ? 'call scheduling' : 'documents under review'
            },
        })

    }
}
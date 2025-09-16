import { PaginationSchemaType } from "@/schemas";
import { AdminUpdateAuctionAccessRequest, AuctionAccessRequestListItem, AuctionAccessRequestStatus, UpdateAuctionAccessRequest } from './types'
import { prismaClient } from "@/infrastructure";
import { ProfileService } from "../profile";
import { EmailAddress } from "@/value-objects/email-address.vo";
import { businessError } from "@/lib/errors";

type FindListQueryData = PaginationSchemaType & { status: AuctionAccessRequestStatus }

export class AuctionAccessRequestsService {
    findRequestsForAdmin = async (query: FindListQueryData): Promise<AuctionAccessRequestListItem[]> => {
        const result = await prismaClient.auctionAccessRequest.findMany({
            skip: query.skip,
            take: query.take,
            where: {
                status: query.status
            }
        })
        return result as AuctionAccessRequestListItem[]
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
        const foundRequest = await prismaClient.auctionAccessRequest.count({ where: { id: payload.id } })
        if (!foundRequest) {
            throw businessError('No according request was found')
        }
        await prismaClient.auctionAccessRequest.update({
            where: { id: payload.id },
            data: {
                activeSlotId: payload.selectedTimeSlotId
            },
        })

    }
}
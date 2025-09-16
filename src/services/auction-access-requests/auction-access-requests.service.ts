import { PaginationSchemaType } from "@/schemas";
import { AuctionAccessRequestListItem, AuctionAccessRequestStatus } from './types'
import { prismaClient } from "@/infrastructure";
import { ProfileService } from "../profile";
import { EmailAddress } from "@/value-objects/email-address.vo";

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
}
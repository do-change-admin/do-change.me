import { AuctionAccessRequestStatus, UserAuctionAccessSchema, userAuctionAccessSchema } from "@/services";
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../zod-api-methods";
import { prismaClient } from "@/infrastructure";

const responseSchema = userAuctionAccessSchema

export type Method = ZodAPIMethod_DEPRECATED<undefined, undefined, typeof responseSchema>

export const handler = zodApiMethod_DEPRECATED(undefined, undefined, responseSchema,
    async ({ activeUser }) => {
        const request = await prismaClient.auctionAccessRequest.findFirst({ where: { email: activeUser.email }, include: { activeSlot: true, timeSlots: true } })

        if (!request) {
            return {
                status: 'active',
                step: 'application',
                activeTimeSlot: null,
                timeSlots: []
            } as UserAuctionAccessSchema
        }

        const activeUserStatuses: AuctionAccessRequestStatus[] = [
            'awaiting documents upload',
            'awaiting user confirmation',
            'approved',
            'rejected',
            'awaiting for payment'
        ]

        const getStep = (status: AuctionAccessRequestStatus) => {
            const callStatuses: AuctionAccessRequestStatus[] = [
                'call completed',
                'call scheduling',
                'awaiting user confirmation'
            ]

            const documentsStatuses: AuctionAccessRequestStatus[] = [
                'awaiting documents upload',
                'documents under review',
                'ready for auction access'
            ]

            const desicionStatuses: AuctionAccessRequestStatus[] = [
                'approved',
                'rejected'
            ]

            if (status === 'awaiting for payment') {
                return 'awaiting for payment' as const
            }

            if (callStatuses.includes(status)) {
                return 'call' as const
            }

            if (documentsStatuses.includes(status)) {
                return 'documents' as const
            }

            if (status === 'approved') {
                return 'approved'
            }

            if (status === 'rejected') {
                return 'rejected'
            }

            return 'application' as const
        }

        return {
            status: activeUserStatuses.includes(request.status as AuctionAccessRequestStatus) ? 'active' : 'pending',
            step: getStep(request.status as AuctionAccessRequestStatus),
            activeTimeSlot: request.activeSlot,
            timeSlots: request.timeSlots
        } satisfies UserAuctionAccessSchema
    })
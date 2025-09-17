import { AuctionAccessRequestStatus, UserAuctionAccessSchema, userAuctionAccessSchema } from "@/services";
import { zodApiMethod, ZodAPIMethod } from "../zod-api-methods";
import { prismaClient } from "@/infrastructure";

const responseSchema = userAuctionAccessSchema

export type Method = ZodAPIMethod<undefined, undefined, typeof responseSchema>

export const handler = zodApiMethod(undefined, undefined, responseSchema,
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
            'awaiting user confirmation'
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
                'corrections required',
                'ready for auction access'
            ]

            const desicionStatuses: AuctionAccessRequestStatus[] = [
                'approved',
                'rejected'
            ]

            if (callStatuses.includes(status)) {
                return 'call' as const
            }

            if (documentsStatuses.includes(status)) {
                return 'documents' as const
            }

            if (desicionStatuses.includes(status)) {
                return 'decision' as const
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
        } as UserAuctionAccessSchema
    })
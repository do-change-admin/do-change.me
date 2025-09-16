import { adminUpdateAuctionAccessRequestSchema, AuctionAccessRequestsService } from "@/services";
import { zodApiMethod, ZodAPIMethod } from "../../zod-api-methods";

export type Method = ZodAPIMethod<undefined, typeof adminUpdateAuctionAccessRequestSchema, undefined>

export const handler = zodApiMethod(
    undefined,
    adminUpdateAuctionAccessRequestSchema,
    undefined,
    async (payload) => {
        const service = new AuctionAccessRequestsService()
        await service.adminUpdate({
            id: payload.id,
            availableTimeSlots: payload.availableTimeSlots,
            progress: payload.progress
        })
    }
)
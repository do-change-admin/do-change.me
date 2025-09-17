import z from "zod";
import { zodApiMethod, ZodAPIMethod } from "../zod-api-methods";
import { AuctionAccessRequestsService, updateAuctionAccessRequestSchema } from "@/services";

const bodySchema = z.object({
    selectedTimeSlotId: z.string().optional(),
})

export type Method = ZodAPIMethod<undefined, typeof bodySchema, undefined>

export const handler = zodApiMethod(undefined, bodySchema, undefined, async (payload) => {
    const service = new AuctionAccessRequestsService()
    await service.update({ selectedTimeSlotId: payload.selectedTimeSlotId, userMail: payload.activeUser.email })
})
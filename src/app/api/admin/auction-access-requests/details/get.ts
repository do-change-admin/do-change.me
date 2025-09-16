import { zodApiMethod, ZodAPIMethod } from "@/app/api/zod-api-methods";
import { auctionAccessRequestFullSchema, AuctionAccessRequestsService } from "@/services";
import z from "zod";

const queryParamsSchema = z.object({
    id: z.string()
})

const responseSchema = auctionAccessRequestFullSchema

export type Method = ZodAPIMethod<typeof queryParamsSchema, undefined, typeof responseSchema>

export const handler = zodApiMethod(queryParamsSchema, undefined, responseSchema, async (payload) => {
    const service = new AuctionAccessRequestsService()
    const result = await service.detailedItemForAdmin(payload.id)

    return result
})
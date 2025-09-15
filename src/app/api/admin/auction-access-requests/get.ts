import { withPaginationSchema } from "@/schemas";
import { auctionAccessRequestListSchema, auctionAccessRequestStatusSchema, AuctionAccessRequestsService } from "@/services";
import z from "zod";
import { zodApiMethod, ZodAPIMethod } from "../../zod-api-methods";

const queryParamsSchema = z.object(
    withPaginationSchema({
        status: auctionAccessRequestStatusSchema
    })
)

const responseSchema = z.object({
    items: z.array(
        auctionAccessRequestListSchema
    )
})

export type Method = ZodAPIMethod<typeof queryParamsSchema, undefined, typeof responseSchema>

export const handler = zodApiMethod(
    queryParamsSchema,
    undefined,
    responseSchema,
    async ({ skip, status, take }) => {
        const service = new AuctionAccessRequestsService()
        const items = await service.findRequests({ skip, status, take })
        return { items }
    }
)
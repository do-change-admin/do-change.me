import { auctionAccessRequestListSchema, auctionAccessRequestStatusSchema, AuctionAccessRequestsAdminService } from "@/services";
import z from "zod";
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../../zod-api-methods";
import { VercelBlobFileSystemProvider } from "@/providers/implementations";

const queryParamsSchema = z.object({
    status: auctionAccessRequestStatusSchema
})

const responseSchema = z.object({
    items: z.array(
        auctionAccessRequestListSchema
    )
})

export type Method = ZodAPIMethod_DEPRECATED<typeof queryParamsSchema, undefined, typeof responseSchema>

export const handler = zodApiMethod_DEPRECATED(
    queryParamsSchema,
    undefined,
    responseSchema,
    async ({ status }) => {
        const fileSystemProvider = new VercelBlobFileSystemProvider()
        const service = new AuctionAccessRequestsAdminService(fileSystemProvider)
        const items = await service.findRequests({ status })
        return { items }
    }
)
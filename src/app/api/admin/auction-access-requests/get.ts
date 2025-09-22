import { withPaginationSchema } from "@/schemas";
import { auctionAccessRequestListSchema, auctionAccessRequestStatusSchema, AuctionAccessRequestsAdminService } from "@/services";
import z from "zod";
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../../zod-api-methods";
import { PublicFolderFileSystemProvider } from "@/providers/implementations";

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

export type Method = ZodAPIMethod_DEPRECATED<typeof queryParamsSchema, undefined, typeof responseSchema>

export const handler = zodApiMethod_DEPRECATED(
    queryParamsSchema,
    undefined,
    responseSchema,
    async ({ skip, status, take }) => {
        const fileSystemProvider = new PublicFolderFileSystemProvider()
        const service = new AuctionAccessRequestsAdminService(fileSystemProvider)
        const items = await service.findRequests({ skip, status, take })
        return { items }
    }
)
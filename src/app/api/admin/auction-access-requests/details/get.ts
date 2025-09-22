import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "@/app/api/zod-api-methods";
import { PublicFolderFileSystemProvider } from "@/providers/implementations";
import { auctionAccessRequestFullSchema, AuctionAccessRequestsAdminService } from "@/services";
import z from "zod";

const queryParamsSchema = z.object({
    id: z.string()
})

const responseSchema = auctionAccessRequestFullSchema

export type Method = ZodAPIMethod_DEPRECATED<typeof queryParamsSchema, undefined, typeof responseSchema>

export const handler = zodApiMethod_DEPRECATED(queryParamsSchema, undefined, responseSchema, async (payload) => {
    const fileSystemProvider = new PublicFolderFileSystemProvider()
    const service = new AuctionAccessRequestsAdminService(fileSystemProvider)
    const result = await service.detailedItem(payload.id)

    return result
})
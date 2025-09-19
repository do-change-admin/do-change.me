import { adminUpdateAuctionAccessRequestSchema, AuctionAccessRequestsAdminService } from "@/services";
import { zodApiMethod, ZodAPIMethod } from "../../zod-api-methods";
import { PublicFolderFileSystemProvider } from "@/providers/implementations";

export type Method = ZodAPIMethod<undefined, typeof adminUpdateAuctionAccessRequestSchema, undefined>

export const handler = zodApiMethod(
    undefined,
    adminUpdateAuctionAccessRequestSchema,
    undefined,
    async (payload) => {
        const fileSystemProvider = new PublicFolderFileSystemProvider()
        const service = new AuctionAccessRequestsAdminService(fileSystemProvider)
        await service.update({
            id: payload.id,
            availableTimeSlots: payload.availableTimeSlots,
            progress: payload.progress
        })
    }
)
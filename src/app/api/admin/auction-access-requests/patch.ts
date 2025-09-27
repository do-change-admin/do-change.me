import { adminUpdateAuctionAccessRequestSchema, AuctionAccessRequestsAdminService } from "@/services";
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../../zod-api-methods";
import { VercelBlobFileSystemProvider } from "@/providers/implementations";

export type Method = ZodAPIMethod_DEPRECATED<undefined, typeof adminUpdateAuctionAccessRequestSchema, undefined>

export const handler = zodApiMethod_DEPRECATED(
    undefined,
    adminUpdateAuctionAccessRequestSchema,
    undefined,
    async (payload) => {
        const fileSystemProvider = new VercelBlobFileSystemProvider()
        const service = new AuctionAccessRequestsAdminService(fileSystemProvider)
        await service.update({
            id: payload.id,
            availableTimeSlots: payload.availableTimeSlots,
            progress: payload.progress
        })
    }
)
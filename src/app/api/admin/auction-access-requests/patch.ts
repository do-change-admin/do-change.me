import { adminUpdateAuctionAccessRequestSchema, AuctionAccessRequestsAdminService } from "@/backend/services";
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../../../../backend/utils/zod-api-controller____DEPRECATED.utils";
import { VercelBlobFileSystemProvider } from "@/backend/providers/implementations";

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
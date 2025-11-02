import z from "zod";
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../../../backend/utils/zod-api-controller.utils";
import { AuctionAccessRequestsUserService } from "@/backend/services";
import { VercelBlobFileSystemProvider } from "@/backend/providers/implementations";

const bodySchema = z.object({
    selectedTimeSlotId: z.string().optional(),
})

export type Method = ZodAPIMethod_DEPRECATED<undefined, typeof bodySchema, undefined>

export const handler = zodApiMethod_DEPRECATED(undefined, bodySchema, undefined, async (payload) => {
    const fileSystemProvider = new VercelBlobFileSystemProvider()
    const service = new AuctionAccessRequestsUserService(fileSystemProvider)
    await service.update({ selectedTimeSlotId: payload.selectedTimeSlotId, userMail: payload.activeUser.email })
})
import z from "zod";
import { zodApiMethod, ZodAPIMethod } from "../zod-api-methods";
import { AuctionAccessRequestsUserService } from "@/services";
import { PublicFolderFileSystemProvider } from "@/providers/implementations";

const bodySchema = z.object({
    selectedTimeSlotId: z.string().optional(),
})

export type Method = ZodAPIMethod<undefined, typeof bodySchema, undefined>

export const handler = zodApiMethod(undefined, bodySchema, undefined, async (payload) => {
    const fileSystemProvider = new PublicFolderFileSystemProvider()
    const service = new AuctionAccessRequestsUserService(fileSystemProvider)
    await service.update({ selectedTimeSlotId: payload.selectedTimeSlotId, userMail: payload.activeUser.email })
})
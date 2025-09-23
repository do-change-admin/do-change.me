import { AuctionAccessRequestsUserService } from "@/services";
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../zod-api-methods";
import { PublicFolderFileSystemProvider } from "@/providers/implementations";

export type Method = ZodAPIMethod_DEPRECATED<undefined, undefined, undefined>

export const handler = zodApiMethod_DEPRECATED(undefined, undefined, undefined, async ({ activeUser }) => {
    const fileSystemProvider = new PublicFolderFileSystemProvider()
    const service = new AuctionAccessRequestsUserService(fileSystemProvider)
    await service.create(activeUser.email)
})
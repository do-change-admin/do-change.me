import { AuctionAccessRequestsUserService } from "@/services";
import { zodApiMethod, ZodAPIMethod } from "../zod-api-methods";
import { PublicFolderFileSystemProvider } from "@/providers/implementations";

export type Method = ZodAPIMethod<undefined, undefined, undefined>

export const handler = zodApiMethod(undefined, undefined, undefined, async ({ activeUser }) => {
    const fileSystemProvider = new PublicFolderFileSystemProvider()
    const service = new AuctionAccessRequestsUserService(fileSystemProvider)
    await service.create(activeUser.email)
})
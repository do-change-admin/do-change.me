import { AuctionAccessRequestsUserService } from "@/backend/services";
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../../../backend/utils/zod-api-controller____DEPRECATED.utils";
import { VercelBlobFileSystemProvider } from "@/backend/providers/implementations";

export type Method = ZodAPIMethod_DEPRECATED<undefined, undefined, undefined>

export const handler = zodApiMethod_DEPRECATED(undefined, undefined, undefined, async ({ activeUser }) => {
    const fileSystemProvider = new VercelBlobFileSystemProvider()
    const service = new AuctionAccessRequestsUserService(fileSystemProvider)
    await service.create(activeUser.id, activeUser.email)
})
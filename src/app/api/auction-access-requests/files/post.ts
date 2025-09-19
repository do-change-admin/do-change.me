import { zodApiMethod, ZodAPIMethod } from "../../zod-api-methods";
import { businessError } from "@/lib/errors";
import { PublicFolderFileSystemProvider } from "@/providers/implementations";
import { AuctionAccessRequestsUserService } from "@/services";

export type Method = ZodAPIMethod<undefined, undefined, undefined>

export const handler = zodApiMethod(undefined, undefined, undefined, async ({ activeUser }, req) => {
    const formData = await req.formData();
    const agreement = formData.get('agreement') as File;
    const license = formData.get('license') as File;

    if (!agreement) {
        throw businessError('No agreement was provided')
    }

    if (!license) {
        throw businessError('No license was provided')
    }

    const fileSystemProvider = new PublicFolderFileSystemProvider()
    const service = new AuctionAccessRequestsUserService(fileSystemProvider)
    await service.uploadFiles(agreement, license, activeUser.email)
})
import { zodApiMethod, ZodAPIMethod } from "../../zod-api-methods";
import { businessError } from "@/lib/errors";
import { PublicFolderFileSystemProvider } from "@/providers/implementations";
import { ProfileService } from "@/services";
import { EmailAddress } from "@/value-objects/email-address.vo";

export type Method = ZodAPIMethod<undefined, undefined, undefined>

export const handler = zodApiMethod(undefined, undefined, undefined, async ({ activeUser }, req) => {
    const formData = await req.formData();
    const photo = formData.get('photo') as File;

    if (!photo) {
        throw businessError('No photo was provided')
    }


    const fileSystemProvider = new PublicFolderFileSystemProvider()
    const service = new ProfileService(EmailAddress.create(activeUser.email), fileSystemProvider)
    await service.uploadPhoto(photo)
})
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../../../../backend/utils/zod-api-controller.utils";
import { businessError } from "@/lib-deprecated/errors";
import { VercelBlobFileSystemProvider } from "@/backend/providers/implementations";
import { ProfileService } from "@/backend/services";
import { EmailAddress } from "@/value-objects/email-address.vo";

export type Method = ZodAPIMethod_DEPRECATED<undefined, undefined, undefined>

export const handler = zodApiMethod_DEPRECATED(undefined, undefined, undefined, async ({ activeUser }, req) => {
    const formData = await req.formData();
    const photo = formData.get('photo') as File;

    if (!photo) {
        throw businessError('No photo was provided')
    }


    const fileSystemProvider = new VercelBlobFileSystemProvider()
    const service = new ProfileService(EmailAddress.create(activeUser.email), fileSystemProvider)
    await service.uploadPhoto(photo)
})
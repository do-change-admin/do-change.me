import { PublicFolderFileSystemProvider } from "@/providers/implementations";
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../zod-api-methods";
import { profileSchema, ProfileService } from "@/services";
import { EmailAddress } from "@/value-objects/email-address.vo";

const responseSchema = profileSchema

export type Method = ZodAPIMethod_DEPRECATED<undefined, undefined, typeof responseSchema>;

export const handler = zodApiMethod_DEPRECATED(undefined, undefined, responseSchema, async (payload) => {
    const { email } = payload.activeUser
    const emailValueObject = EmailAddress.create(email)
    const service = new ProfileService(emailValueObject, new PublicFolderFileSystemProvider())
    const profileData = await service.profileData()

    return profileData
})

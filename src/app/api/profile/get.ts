import { zodApiMethod, ZodAPIMethod } from "../zod-api-methods";
import { profileSchema, ProfileService } from "@/services";
import { EmailAddress } from "@/value-objects/email-address.vo";

const responseSchema = profileSchema

export type Method = ZodAPIMethod<undefined, undefined, typeof responseSchema>

export const handler = zodApiMethod(undefined, undefined, responseSchema, async (payload) => {
    const { email } = payload.activeUser
    const emailValueObject = EmailAddress.create(email)
    const service = new ProfileService(emailValueObject)
    const profileData = await service.profileData()

    return profileData
})
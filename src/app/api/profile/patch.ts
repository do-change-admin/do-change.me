import { EmailAddress } from "@/value-objects/email-address.vo";
import { zodApiMethod, ZodAPIMethod } from "../zod-api-methods";
import { updateProfileSchema, ProfileService } from '@/services'
import { PublicFolderFileSystemProvider } from "@/providers/implementations";

const bodySchema = updateProfileSchema

export type Method = ZodAPIMethod<undefined, typeof bodySchema, undefined>

export const handler = zodApiMethod(undefined, bodySchema, undefined, async (payload) => {
    const { email } = payload.activeUser
    const emailValueObject = EmailAddress.create(email)
    const service = new ProfileService(emailValueObject, new PublicFolderFileSystemProvider())
    await service.update({
        bio: payload.bio,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        birthDate: payload.birthDate
    })
})
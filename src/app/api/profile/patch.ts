import { EmailAddress } from "@/value-objects/email-address.vo";
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../zod-api-methods";
import { updateProfileSchema, ProfileService } from '@/services'
import { PublicFolderFileSystemProvider } from "@/providers/implementations";

const bodySchema = updateProfileSchema

export type Method = ZodAPIMethod_DEPRECATED<undefined, typeof bodySchema, undefined>

export const handler = zodApiMethod_DEPRECATED(undefined, bodySchema, undefined, async (payload) => {
    const { email } = payload.activeUser
    const emailValueObject = EmailAddress.create(email)
    const service = new ProfileService(emailValueObject, new PublicFolderFileSystemProvider())
    await service.update({
        bio: payload.bio,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        birthDate: payload.birthDate,
        address: payload.address,
        zipCode: payload.zipCode,
        state: payload.state,
        auctionAccessNumber: payload.auctionAccessNumber,
        auctionAccessQRLink: payload.auctionAccessQRLink,
    })
})
import { EmailAddress } from "@/value-objects/email-address.vo";
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../../../backend/utils/zod-api-controller____DEPRECATED.utils";
import { updateProfileSchema, ProfileService } from '@/backend/services'
import { VercelBlobFileSystemProvider } from "@/backend/providers/implementations";

const bodySchema = updateProfileSchema

export type Method = ZodAPIMethod_DEPRECATED<undefined, typeof bodySchema, undefined>

export const handler = zodApiMethod_DEPRECATED(undefined, bodySchema, undefined, async (payload) => {
    const { id } = payload.activeUser
    const service = new ProfileService(id, new VercelBlobFileSystemProvider())
    await service.update({
        bio: payload.bio,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        birthDate: payload.birthDate,
        address: payload.address,
        zipCode: payload.zipCode,
        state: payload.state,
    })
})
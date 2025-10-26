import { VercelBlobFileSystemProvider } from "@/backend/providers/implementations";
import { zodApiMethod, ZodAPIMethod, zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED, ZodAPISchemas } from "../zod-api-methods";
import { profileSchema, ProfileService } from "@/backend/services";
import { EmailAddress } from "@/value-objects/email-address.vo";

const schemas = {
    body: undefined,
    query: undefined,
    response: profileSchema
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>;

export const handler = zodApiMethod(schemas, {
    handler: async ({ activeUser }) => {
        const { email } = activeUser
        const emailValueObject = EmailAddress.create(email)
        const service = new ProfileService(emailValueObject, new VercelBlobFileSystemProvider())
        const profileData = await service.profileData()

        return profileData
    }
})

import { VercelBlobFileSystemProvider } from '@/backend/providers/implementations';
import { ProfileService, updateProfileSchema } from '@/backend/services';
import { EmailAddress } from '@/value-objects/email-address.value-object';
import {
    type ZodAPIMethod_DEPRECATED,
    zodApiMethod_DEPRECATED
} from '../../../backend/DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';

const bodySchema = updateProfileSchema;

export type Method = ZodAPIMethod_DEPRECATED<undefined, typeof bodySchema, undefined>;

export const handler = zodApiMethod_DEPRECATED(undefined, bodySchema, undefined, async (payload) => {
    const { email } = payload.activeUser;
    const emailValueObject = EmailAddress.create(email);
    const service = new ProfileService(emailValueObject, new VercelBlobFileSystemProvider());
    await service.update({
        bio: payload.bio,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        birthDate: payload.birthDate,
        address: payload.address,
        zipCode: payload.zipCode,
        state: payload.state
    });
});

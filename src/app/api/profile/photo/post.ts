import { VercelBlobFileSystemProvider } from '@/backend/providers/implementations';
import { ProfileService } from '@/backend/services';
import { businessError } from '@/lib-deprecated/errors';
import { EmailAddress } from '@/value-objects/email-address.value-object';
import {
    type ZodAPIMethod_DEPRECATED,
    zodApiMethod_DEPRECATED
} from '../../../../backend/DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';

export type Method = ZodAPIMethod_DEPRECATED<undefined, undefined, undefined>;

export const handler = zodApiMethod_DEPRECATED(undefined, undefined, undefined, async ({ activeUser }, req) => {
    const formData = await req.formData();
    const photo = formData.get('photo') as File;

    if (!photo) {
        throw businessError('No photo was provided');
    }

    const fileSystemProvider = new VercelBlobFileSystemProvider();
    const service = new ProfileService(EmailAddress.create(activeUser.email), fileSystemProvider);
    await service.uploadPhoto(photo);
});

import { VercelBlobFileSystemProvider } from '@/backend/providers/implementations';
import { AuctionAccessRequestsUserService } from '@/backend/services';
import { businessError } from '@/lib-deprecated/errors';
import {
    type ZodAPIMethod_DEPRECATED,
    zodApiMethod_DEPRECATED
} from '../../../../backend/DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';

export type Method = ZodAPIMethod_DEPRECATED<undefined, undefined, undefined>;

export const handler = zodApiMethod_DEPRECATED(undefined, undefined, undefined, async ({ activeUser }, req) => {
    const formData = await req.formData();
    const agreement = formData.get('agreement') as File;
    const license = formData.get('license') as File;
    const auctionAccessNumber = formData.get('auctionAccessNumber') as string;

    if (!auctionAccessNumber) {
        throw businessError('No auction access number was provided');
    }

    if (!agreement) {
        throw businessError('No agreement was provided');
    }

    if (!license) {
        throw businessError('No license was provided');
    }

    const fileSystemProvider = new VercelBlobFileSystemProvider();
    const service = new AuctionAccessRequestsUserService(fileSystemProvider);
    await service.uploadFiles(agreement, license, auctionAccessNumber, activeUser.email);
});

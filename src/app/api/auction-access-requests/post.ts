import { VercelBlobFileSystemProvider } from '@/backend/providers/implementations';
import { AuctionAccessRequestsUserService } from '@/backend/services';
import {
    type ZodAPIMethod_DEPRECATED,
    zodApiMethod_DEPRECATED
} from '../../../backend/DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';

export type Method = ZodAPIMethod_DEPRECATED<undefined, undefined, undefined>;

export const handler = zodApiMethod_DEPRECATED(undefined, undefined, undefined, async ({ activeUser }) => {
    const fileSystemProvider = new VercelBlobFileSystemProvider();
    const service = new AuctionAccessRequestsUserService(fileSystemProvider);
    await service.create(activeUser.email);
});

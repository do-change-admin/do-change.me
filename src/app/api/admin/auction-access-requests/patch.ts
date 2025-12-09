import { VercelBlobFileSystemProvider } from '@/backend/providers/implementations';
import { AuctionAccessRequestsAdminService, adminUpdateAuctionAccessRequestSchema } from '@/backend/services';
import {
    type ZodAPIMethod_DEPRECATED,
    zodApiMethod_DEPRECATED
} from '../../../../backend/DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';

export type Method = ZodAPIMethod_DEPRECATED<undefined, typeof adminUpdateAuctionAccessRequestSchema, undefined>;

export const handler = zodApiMethod_DEPRECATED(undefined, adminUpdateAuctionAccessRequestSchema, undefined, async (payload) => {
    const fileSystemProvider = new VercelBlobFileSystemProvider();
    const service = new AuctionAccessRequestsAdminService(fileSystemProvider);
    await service.update({
        id: payload.id,
        availableTimeSlots: payload.availableTimeSlots,
        progress: payload.progress
    });
});

import z from 'zod';
import { VercelBlobFileSystemProvider } from '@/backend/providers/implementations';
import { AuctionAccessRequestsUserService } from '@/backend/services';
import {
    type ZodAPIMethod_DEPRECATED,
    zodApiMethod_DEPRECATED
} from '../../../backend/DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';

const bodySchema = z.object({
    selectedTimeSlotId: z.string().optional()
});

export type Method = ZodAPIMethod_DEPRECATED<undefined, typeof bodySchema, undefined>;

export const handler = zodApiMethod_DEPRECATED(undefined, bodySchema, undefined, async (payload) => {
    const fileSystemProvider = new VercelBlobFileSystemProvider();
    const service = new AuctionAccessRequestsUserService(fileSystemProvider);
    await service.update({ selectedTimeSlotId: payload.selectedTimeSlotId, userMail: payload.activeUser.email });
});

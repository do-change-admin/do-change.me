import z from 'zod';
import { VercelBlobFileSystemProvider } from '@/backend/providers/implementations';
import { AuctionAccessRequestsAdminService, auctionAccessRequestListSchema, auctionAccessRequestStatusSchema } from '@/backend/services';
import {
    type ZodAPIMethod_DEPRECATED,
    zodApiMethod_DEPRECATED
} from '../../../../backend/DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';

const queryParamsSchema = z.object({
    status: auctionAccessRequestStatusSchema
});

const responseSchema = z.object({
    items: z.array(auctionAccessRequestListSchema)
});

export type Method = ZodAPIMethod_DEPRECATED<typeof queryParamsSchema, undefined, typeof responseSchema>;

export const handler = zodApiMethod_DEPRECATED(queryParamsSchema, undefined, responseSchema, async ({ status }) => {
    const fileSystemProvider = new VercelBlobFileSystemProvider();
    const service = new AuctionAccessRequestsAdminService(fileSystemProvider);
    const items = await service.findRequests({ status });
    return { items };
});

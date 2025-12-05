import z from 'zod';
import { type ZodAPIMethod_DEPRECATED, zodApiMethod_DEPRECATED } from '@/backend/DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';
import { VercelBlobFileSystemProvider } from '@/backend/providers/implementations';
import { AuctionAccessRequestsAdminService, auctionAccessRequestFullSchema } from '@/backend/services';

const queryParamsSchema = z.object({
    id: z.string()
});

const responseSchema = auctionAccessRequestFullSchema;

export type Method = ZodAPIMethod_DEPRECATED<typeof queryParamsSchema, undefined, typeof responseSchema>;

export const handler = zodApiMethod_DEPRECATED(queryParamsSchema, undefined, responseSchema, async (payload) => {
    const fileSystemProvider = new VercelBlobFileSystemProvider();
    const service = new AuctionAccessRequestsAdminService(fileSystemProvider);
    const result = await service.detailedItem(payload.id);

    return result;
});

import { type ZodAPIMethod, type ZodAPISchemas, zodApiMethod } from '@/backend/DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';
import { VercelBlobFileSystemProvider } from '@/backend/providers/implementations';
import { AuctionAccessRequestsAdminService, auctionAccessRequestCountByStagesSchema } from '@/backend/services';

const schemas = {
    body: undefined,
    query: undefined,
    response: auctionAccessRequestCountByStagesSchema
} satisfies ZodAPISchemas;

export type Method = ZodAPIMethod<typeof schemas>;

export const method = zodApiMethod(schemas, {
    handler: async () => {
        const service = new AuctionAccessRequestsAdminService(new VercelBlobFileSystemProvider());
        const data = await service.count();
        return data;
    }
});

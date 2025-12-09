import z from 'zod';
import { type ZodAPIMethod, type ZodAPISchemas, zodApiMethod } from '@/backend/DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';
import { VercelBlobFileSystemProvider } from '@/backend/providers/implementations';
import { AuctionAccessRequestsAdminService, auctionAccessRequestStatusSchema } from '@/backend/services';

const schemas = {
    body: z.object({
        newStatus: auctionAccessRequestStatusSchema
    }),
    query: z.object({
        id: z.string().nonempty()
    }),
    response: undefined
} satisfies ZodAPISchemas;

export type Method = ZodAPIMethod<typeof schemas>;

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const service = new AuctionAccessRequestsAdminService(new VercelBlobFileSystemProvider());
        await service.setStatus(payload.id, payload.newStatus);
    }
});

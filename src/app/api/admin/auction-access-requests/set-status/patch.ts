import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { VercelBlobFileSystemProvider } from "@/backend/providers/implementations";
import { AuctionAccessRequestsAdminService, auctionAccessRequestStatusSchema } from "@/backend/services";
import z from "zod";

const schemas = {
    body: z.object({
        newStatus: auctionAccessRequestStatusSchema
    }),
    query: z.object({
        id: z.string().nonempty(),
    }),
    response: undefined
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const service = new AuctionAccessRequestsAdminService(new VercelBlobFileSystemProvider())
        await service.setStatus(payload.id, payload.newStatus)
    }
})
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { PublicFolderFileSystemProvider } from "@/providers/implementations";
import { AuctionAccessRequestsAdminService, auctionAccessRequestStatusSchema } from "@/services";
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
        const service = new AuctionAccessRequestsAdminService(new PublicFolderFileSystemProvider())
        await service.setStatus(payload.id, payload.newStatus)
    }
})
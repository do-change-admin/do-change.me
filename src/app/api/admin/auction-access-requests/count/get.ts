import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/backend/utils/zod-api-controller.utils";
import { VercelBlobFileSystemProvider } from "@/backend/providers/implementations";
import { auctionAccessRequestCountByStagesSchema, AuctionAccessRequestsAdminService } from "@/backend/services";

const schemas = {
    body: undefined,
    query: undefined,
    response: auctionAccessRequestCountByStagesSchema
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async () => {
        const service = new AuctionAccessRequestsAdminService(new VercelBlobFileSystemProvider())
        const data = await service.count()
        return data
    }
})
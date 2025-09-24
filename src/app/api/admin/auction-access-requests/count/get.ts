import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { PublicFolderFileSystemProvider } from "@/providers/implementations";
import { auctionAccessRequestCountByStagesSchema, AuctionAccessRequestsAdminService } from "@/services";

const schemas = {
    body: undefined,
    query: undefined,
    response: auctionAccessRequestCountByStagesSchema
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async () => {
        const service = new AuctionAccessRequestsAdminService(new PublicFolderFileSystemProvider())
        const data = await service.count()
        return data
    }
})
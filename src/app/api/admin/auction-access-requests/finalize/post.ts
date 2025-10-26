import { zodApiMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { prismaClient } from "@/backend/infrastructure";
import { businessError } from "@/lib-deprecated/errors";
import { VercelBlobFileSystemProvider } from "@/backend/providers/implementations";
import { v4 } from "uuid";
import z from "zod";

const schemas = {
    body: undefined,
    query: z.object({ id: z.string() }),
    response: undefined
} satisfies ZodAPISchemas

export const method = zodApiMethod(schemas, {
    handler: async ({ req, payload: { id } }) => {
        const formData = await req.formData();
        const qr = formData.get('qr') as File;
        const auctionAccessNumber = formData.get('number') as string;
        const provider = new VercelBlobFileSystemProvider()
        const auctionAccessQRFileId = `${v4()}-${qr.name}`
        await provider.upload(qr, auctionAccessQRFileId, qr.name)

        const request = await prismaClient.auctionAccessRequest.findUnique({
            where: { id }
        })

        if (!request) {
            throw businessError('No request was found', undefined, 404)
        }

        await prismaClient.user.update({
            where: { email: request.email },
            data: {
                auctionAccessNumber,
                auctionAccessQRFileId
            }
        })
    }
})
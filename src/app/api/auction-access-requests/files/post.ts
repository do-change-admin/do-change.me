import z from "zod";
import { zodApiMethod, ZodAPIMethod } from "../../zod-api-methods";
import { prismaClient } from "@/infrastructure";
import { businessError } from "@/lib/errors";
import { put } from "@vercel/blob";

const querySchema = z.object({
    variant: z.enum(['license', 'agreement'])
})

export type Method = ZodAPIMethod<typeof querySchema, undefined, undefined>

export const handler = zodApiMethod(querySchema, undefined, undefined, async ({ activeUser, variant }, req) => {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
        throw businessError('No file was provided')
    }

    const uniqueName = `${Date.now()}-${file.name}`;

    const blob = await put(uniqueName, file, {
        access: 'public'
    });

    const { id: fileId } = await prismaClient.uploadedFile.create({
        data: {
            filename: file.name,
            pathname: blob.pathname,
            url: blob.url,
            contentType: blob.contentType,
            uploadedAt: new Date(),
        },
    });

    const request = await prismaClient.auctionAccessRequest.findFirst({ where: { email: activeUser.email } })

    if (!request) {
        throw businessError('No active request was found', undefined, 404)
    }

    if (variant === 'license') {
        await prismaClient.auctionAccessRequest.update({
            where: { id: request.id },
            data: { driverLicenceId: fileId }
        })
    }

    if (variant === 'agreement') {
        await prismaClient.auctionAccessRequest.update({
            where: { id: request.id },
            data: { driverLicenceId: fileId }
        })
    }
})
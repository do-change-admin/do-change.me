import { prismaClient } from '@/infrastructure';
import { getCurrentUserMail } from '@/services/actions-history';
import { put } from '@vercel/blob';
import { NextRequest } from 'next/server';

export const runtime = 'edge'; // обязательно для Vercel Blob

/**
 * Query parameters - {variant: license | agreement}
 */
export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const params = req.nextUrl.searchParams
    const variant = params.get('variant')
    const file = formData.get('file') as File;

    if (!file) {
        return new Response('No file uploaded', { status: 400 });
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

    if (!['license', 'agreement'].includes(variant || "")) {
        return Response.json({ success: true, url: blob.url, pathname: blob.pathname });
    }

    const email = await getCurrentUserMail();
    const request = await prismaClient.auctionAccessRequest.findFirst({ where: { email } })

    if (!request) {
        return Response.json({ success: false, url: blob.url, pathname: blob.pathname }, { status: 404 });
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

    return Response.json({ success: true, url: blob.url, pathname: blob.pathname });
}

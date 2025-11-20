import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucket = process.env.S3_PICTURES_BUCKET;

const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.S3_LINK!,
    credentials: {
        accessKeyId: process.env.S3_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
});

import { injectable } from "inversify";
import type { Interface } from "../../contracts/pictures.data-provider";
import { v4 } from "uuid";

@injectable()
export class PicturesS3DataProvider implements Interface {
    add: Interface["add"] = async (file) => {
        try {
            const id = `${v4()}-${file.name}`
            await s3Client.send(
                new PutObjectCommand({
                    Bucket: bucket,
                    Key: id,
                    Body: Buffer.from(await file.arrayBuffer()),
                })
            );

            return { id, success: true };
        } catch (e) {
            return { id: null, success: false };
        }
    };

    findOne: Interface["findOne"] = async (id) => {
        try {
            const command = new GetObjectCommand({
                Bucket: bucket,
                Key: id,
            });

            const signedUrl = await getSignedUrl(s3Client, command, {
                expiresIn: 3600,
            });

            // console.log(signedUrl, "SIGNED")

            return {
                id,
                src: signedUrl,
            };

        } catch (e) {
            console.error(e)
            throw e
        }
    };
}

import { S3Client as AWSS3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { injectable } from 'inversify';
import type { S3Client } from './s3-client.provider';

@injectable()
export class S3ClientAWSSDK implements S3Client {
    private readonly client = new AWSS3Client({
        region: 'auto',
        endpoint: process.env.S3_LINK!,
        credentials: {
            accessKeyId: process.env.S3_KEY_ID!,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
        }
    });

    private readonly expiresIn = 10000;

    signedDownloadLink: S3Client['signedDownloadLink'] = async (bucket, key) => {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key
        });

        const result = await getSignedUrl(this.client, command, {
            expiresIn: this.expiresIn
        });

        return result;
    };

    signedUploadLink: S3Client['signedUploadLink'] = async (bucket, key) => {
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key
        });

        const result = await getSignedUrl(this.client, command, {
            expiresIn: this.expiresIn
        });

        return result;
    };
}

import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';
import { DIProviders } from '@/backend/di-containers/tokens.di-container';
import type { S3Client } from '@/backend/providers/s3-client/s3-client.provider';

@injectable()
export class PicturesService {
    public constructor(@inject(DIProviders.s3Client) private readonly s3Client: S3Client) {}

    uploadFileLink = async (bucketName: string, _fileName: string, _fileType: string) => {
        const fileKey = v4();
        const uploadLink = await this.s3Client.signedUploadLink(bucketName, fileKey);

        return { fileKey, uploadLink };
    };

    downloadFileLink = async (bucketName: string, key: string) => {
        const downloadLink = await this.s3Client.signedDownloadLink(bucketName, key);

        return { downloadLink };
    };
}

import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';
import { DIProviders } from '@/backend/di-containers/tokens.di-container';
import type { S3Client } from '@/backend/providers/s3-client/s3-client.provider';
import type { RemotePicturesStore } from './remote-pictures.store';

@injectable()
export class RemotePicturesS3ClientStore implements RemotePicturesStore {
    public constructor(@inject(DIProviders.s3Client) private readonly s3Client: S3Client) {}

    uploadLink: RemotePicturesStore['uploadLink'] = async () => {
        const id = v4();
        const uploadLink = await this.s3Client.signedUploadLink(process.env.S3_PICTURES_BUCKET!, id);

        return { id, uploadLink };
    };

    downloadLink: RemotePicturesStore['downloadLink'] = async ({ id }) => {
        const link = await this.s3Client.signedDownloadLink(process.env.S3_PICTURES_BUCKET!, id);

        return { downloadLink: link };
    };
}

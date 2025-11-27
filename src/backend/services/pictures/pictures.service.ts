import { DIProviders } from "@/backend/di-containers/tokens.di-container";
import { type S3Client } from "@/backend/providers/s3-client/s3-client.provider";
import { inject, injectable } from "inversify";
import { v4 } from "uuid";

@injectable()
export class PicturesService {
    public constructor(
        @inject(DIProviders.s3Client) private readonly s3Client: S3Client
    ) {}

    uploadFileLink = async (bucketName: string, fileName: string, fileType: string) => {
        const fileKey = v4()
        const uploadLink = await this.s3Client.signedUploadLink(
            bucketName,
            fileKey,
            fileType,
            fileName
        )

        return { fileKey, uploadLink }
    }

    downloadFileLink = async (bucketName: string, key: string) => {
        const downloadLink = await this.s3Client.signedDownloadLink(bucketName, key)

        return { downloadLink }
    }
}
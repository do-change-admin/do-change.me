import { inject, injectable } from "inversify";
import { RemotePicturesStore } from "./remote-pictures.store";
import { DIProviders } from "@/backend/di-containers/tokens.di-container";
import { type S3Client } from "@/backend/providers/s3-client/s3-client.provider";
import { v4 } from "uuid";

@injectable()
export class RemotePicturesS3ClientStore implements RemotePicturesStore {
    public constructor(
        @inject(DIProviders.s3Client) private readonly s3Client: S3Client
    ) {}

    uploadLink: RemotePicturesStore['uploadLink'] = async ({ fileName, fileType }) => {
        const id = v4()
        const uploadLink = await this.s3Client.signedUploadLink(
            process.env.S3_PICTURES_BUCKET!,
            id,
            fileType,
            fileName
        )

        return { id, uploadLink }
    }

    downloadLink: RemotePicturesStore['downloadLink'] = async ({ id }) => {
        const link = await this.s3Client.signedDownloadLink(
            process.env.S3_PICTURES_BUCKET!,
            id
        )

        return { downloadLink: link }
    }
}
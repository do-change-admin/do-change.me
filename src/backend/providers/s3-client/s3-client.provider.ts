export interface S3Client {
    signedDownloadLink(bucket: string, key: string): Promise<string>;
    signedUploadLink(bucket: string, key: string, fileType?: string, originalName?: string): Promise<string>;
}
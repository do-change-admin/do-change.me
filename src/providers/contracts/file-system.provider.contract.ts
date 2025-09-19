export interface ProvidesFileUploading {
    upload(file: File, id: string, originalFileName: string): Promise<{ success: boolean }>
}

export interface ProvidesFileLink {
    obtainDownloadLink(id: string): Promise<string | null>
}
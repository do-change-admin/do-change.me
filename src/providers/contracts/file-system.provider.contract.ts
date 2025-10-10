export interface ProvidesFileUploading {
    upload(file: File, id: string, originalFileName: string): Promise<{ success: boolean }>
}

export interface ProvidesFileLink {
    obtainDownloadLink(id: string): Promise<string | null>
}

/**
 * !!! OBSOLETE, USE DataProviders.Pictures.Interface IN NEW CODE !!!
 */
export type FileSystemProvider = ProvidesFileUploading & ProvidesFileLink
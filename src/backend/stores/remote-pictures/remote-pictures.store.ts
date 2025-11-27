export type RemotePicturesStore = {
    uploadLink: (payload: { fileName: string, fileType: string }) => Promise<{ id: string, uploadLink: string }>;
    downloadLink: (payload: { id: string }) => Promise<{ downloadLink: string }>
}
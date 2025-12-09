export type RemotePicturesStore = {
    uploadLink: () => Promise<{ id: string; uploadLink: string }>;
    downloadLink: (payload: { id: string }) => Promise<{ downloadLink: string }>;
};

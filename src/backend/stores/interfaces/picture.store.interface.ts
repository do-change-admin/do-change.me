export type PictureDetails = {
    id: string;
    src: string;
}

export type Pictures = {
    add: (pictureFile: File) => Promise<{ id: string, success: true } | { id: null, success: false }>,
    findOne: (id: string) => Promise<PictureDetails | null>,
}

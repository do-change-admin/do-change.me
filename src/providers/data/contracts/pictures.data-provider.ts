export type Item = {
    id: string;
    src: string;
}

export type Interface = {
    add: (pictureFile: File) => Promise<{ id: string, success: true } | { id: null, success: false }>,
    findOne: (id: string) => Promise<Item | null>,
}
export type Item = {
    htmlMarkup: string;
}
export type FindOnePayload = {
    vin: string;
}

export type Interface = {
    findOne: (payload: FindOnePayload) => Promise<Item>
}

export type CacheInterface = {
    create: (vin: string, report: string) => Promise<void>,
    find: (vin: string) => Promise<{ report: string, cachedAt: Date } | null>,
}
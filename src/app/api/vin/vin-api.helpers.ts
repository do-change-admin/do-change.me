export const isDemoVin = async ({ payload: { vin } }: { payload: { vin: string } }) => {
    return vin === process.env.DEMO_VIN
}

export enum VinAPIFlags {
    DATA_WAS_TAKEN_FROM_CACHE = 'DATA_WAS_TAKEN_FROM_CACHE'
}
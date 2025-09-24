export const isDemoVin = async ({ payload: { vin } }: { payload: { vin: string } }) => {
    return vin === process.env.DEMO_VIN
}
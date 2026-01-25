export interface CarStickerProvider {
    pdfBuffer(vin: string): Promise<Buffer>;
}

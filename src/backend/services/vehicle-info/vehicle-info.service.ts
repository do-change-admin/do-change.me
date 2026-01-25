import { inject, injectable } from 'inversify';
import { DIProviders } from '@/backend/di-containers/tokens.di-container';
import type { CarStickerProvider } from '@/backend/providers/car-sticker';
import { ZodService } from '@/backend/utils/zod-service.utils';
import { vehicleInfoServiceMetadata } from './vehicle-info.service.metadata';

@injectable()
export class VehicleInfoService extends ZodService(vehicleInfoServiceMetadata) {
    constructor(@inject(DIProviders.carSticker) private readonly carStickerProvider: CarStickerProvider) {
        super();
    }

    getSticker = this.method('getSticker', async ({ vin }) => {
        const pdfBuffer = await this.carStickerProvider.pdfBuffer(vin);

        return { pdfBuffer };
    });
}

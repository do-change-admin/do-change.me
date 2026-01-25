import { inject, injectable } from 'inversify';
import { NextResponse } from 'next/server';
import { DIServices } from '@/backend/di-containers/tokens.di-container';
import type { VehicleInfoService } from '@/backend/services/vehicle-info';
import { ZodController } from '@/backend/utils/zod-controller.utils';
import { vehicleInfoControllerMetadata } from './vehicle-info.controller.metadata';

@injectable()
export class VehicleInfoController extends ZodController(vehicleInfoControllerMetadata) {
    constructor(@inject(DIServices.vehicleInfo) private readonly vehicleInfoService: VehicleInfoService) {
        super();
    }

    sticker_GET = this.endpoint('sticker_GET', this.vehicleInfoService.getSticker, {
        customReturnValue: (_, { pdfBuffer }) => {
            return new NextResponse(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'inline; filename="window_sticker.pdf"'
                }
            });
        }
    });
}

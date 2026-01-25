import { vehicleInfoServiceMetadata } from '@/backend/services/vehicle-info';
import type { ZodControllerAPI, ZodControllerMetadata } from '@/backend/utils/zod-controller.utils';

export const vehicleInfoControllerMetadata = {
    name: 'VehicleInfo',
    schemas: {
        sticker_GET: {
            query: vehicleInfoServiceMetadata.schemas.getSticker.payload,
            response: vehicleInfoServiceMetadata.schemas.getSticker.response
        }
    }
} satisfies ZodControllerMetadata;

export type VehicleInfoAPI = ZodControllerAPI<typeof vehicleInfoControllerMetadata>;

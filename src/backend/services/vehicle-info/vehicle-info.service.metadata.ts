import z from 'zod';
import type { ZodServiceDTOs, ZodServiceMetadata } from '@/backend/utils/zod-service.utils';
import { VIN } from '@/value-objects/vin.value-object';

export const vehicleInfoServiceMetadata = {
    name: 'VehicleInfo',
    schemas: {
        getSticker: {
            payload: z.object({ vin: VIN.schema }),
            response: z.object({ pdfBuffer: z.instanceof(Buffer) })
        }
    }
} satisfies ZodServiceMetadata;

export type VehicleInfoServiceDTOs = ZodServiceDTOs<typeof vehicleInfoServiceMetadata>;

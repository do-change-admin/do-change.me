import z from 'zod';
import type { ZodControllerAPI, ZodControllerMetadata } from '@/backend/utils/zod-controller.utils';
import { Identifier } from '@/utils/entities/identifier';

export const remotePicturesControllerMetadata = {
    name: 'RemotePictures',
    schemas: {
        POST: {
            query: undefined,
            body: undefined,
            response: z.object({ id: Identifier.schema, uploadLink: z.url() })
        }
    }
} satisfies ZodControllerMetadata;

export type RemotePicturesAPI = ZodControllerAPI<typeof remotePicturesControllerMetadata>;

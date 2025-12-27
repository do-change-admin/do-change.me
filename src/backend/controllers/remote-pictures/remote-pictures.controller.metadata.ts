import z from 'zod';
import type { ZodControllerAPI, ZodControllerMetadata } from '@/backend/utils/zod-controller.utils';
import { Identifier } from '@/utils/entities/identifier';

const uploadPhotoData = z.object({ id: Identifier.schema, uploadLink: z.url() });

export const remotePicturesControllerMetadata = {
    name: 'RemotePictures',
    schemas: {
        POST: {
            response: uploadPhotoData
        },

        List_POST: {
            query: z.object({ count: z.coerce.number().int().positive() }),
            response: z.object({ items: z.array(uploadPhotoData) })
        },

        WithoutBackground_POST: {
            body: z.object({ pictureIds: z.array(Identifier.schema), backgroundImageId: z.string().optional() }),
            response: z.object({ imagesWithoutBackground: z.array(z.string().nonempty()) })
        }
    }
} satisfies ZodControllerMetadata;

export type RemotePicturesAPI = ZodControllerAPI<typeof remotePicturesControllerMetadata>;

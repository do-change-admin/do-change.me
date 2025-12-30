import { inject, injectable } from 'inversify';
import { DIStores } from '@/backend/di-containers/tokens.di-container';
import type { RemotePicturesStore } from '@/backend/stores/remote-pictures';
import { ZodController } from '@/backend/utils/zod-controller.utils';
import { remotePicturesControllerMetadata } from './remote-pictures.controller.metadata';

function base64ToFile(base64: string, filename: string, mimeType = 'image/png') {
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

    const byteString = atob(cleanBase64);
    const byteArray = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
    }

    return new File([byteArray], filename, { type: mimeType });
}

@injectable()
export class RemotePicturesController extends ZodController(remotePicturesControllerMetadata) {
    constructor(@inject(DIStores.remotePictures) private readonly remotePictures: RemotePicturesStore) {
        super();
    }

    POST = this.endpointWithAuth('POST', this.remotePictures.uploadLink);

    List_POST = this.endpointWithAuth('List_POST', async ({ count }) => {
        const items = [] as Array<{ id: string; uploadLink: string }>;

        for (let i = 0; i < count; i++) {
            const currentPhotoData = await this.remotePictures.uploadLink();
            items.push(currentPhotoData);
        }

        return { items };
    });

    WithoutBackground_POST = this.endpointWithAuth(
        'WithoutBackground_POST',
        async ({ pictureIds, backgroundImageId }) => {
            const rapidApiKey = 'f83a8c6d84msh27789c1167c85b6p1eec1ajsn9b2abef80aca';
            const rapidApiHost = 'cars-image-background-removal.p.rapidapi.com';

            const backroundImageURL = '/bgcarmax.png';

            if (backgroundImageId) {
                const { downloadLink } = await this.remotePictures.downloadLink({ id: backgroundImageId });
                backgroundImageId = downloadLink;
            }

            const result: string[] = [];

            const uploadedResult: string[] = [];

            for (const id of pictureIds) {
                const { downloadLink } = await this.remotePictures.downloadLink({ id });
                const formData = new FormData();

                formData.append('url', downloadLink);

                // if (backroundImageURL) {
                //     formData.append('url-bg', backroundImageURL);
                // }

                const response = await fetch(
                    'https://cars-image-background-removal.p.rapidapi.com/v1/results?mode=fg-image-shadow',
                    {
                        method: 'POST',
                        headers: {
                            'x-rapidapi-host': rapidApiHost,
                            'x-rapidapi-key': rapidApiKey
                        },
                        body: formData
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const file = base64ToFile(data?.results?.[0]?.entities?.[0]?.image, 'image_without_background.png');
                    const { id, uploadLink } = await this.remotePictures.uploadLink();
                    const uploadResponse = await fetch(uploadLink, {
                        body: file,
                        method: 'PUT',
                        headers: {
                            'Content-Type': file.type
                        }
                    });
                    if (uploadResponse.ok) {
                        uploadedResult.push(id);
                    }
                }
            }

            for (const uploaded of uploadedResult) {
                const { downloadLink } = await this.remotePictures.downloadLink({ id: uploaded });
                result.push(downloadLink);
            }

            console.log('RESULT', result);

            return { imagesWithoutBackground: result };
        }
    );
}

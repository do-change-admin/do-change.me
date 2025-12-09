import { inject, injectable } from 'inversify';
import { DIStores } from '@/backend/di-containers/tokens.di-container';
import type { RemotePicturesStore } from '@/backend/stores/remote-pictures';
import { ZodController } from '@/backend/utils/zod-controller.utils';
import { remotePicturesControllerMetadata } from './remote-pictures.controller.metadata';

@injectable()
export class RemotePicturesController extends ZodController(remotePicturesControllerMetadata) {
    constructor(@inject(DIStores.remotePictures) private readonly remotePictures: RemotePicturesStore) {
        super();
    }

    POST = this.loggedEndpoint('POST', {
        handler: () => this.remotePictures.uploadLink()
    });
}

import { inject, injectable } from 'inversify';
import { DIStores } from '@/backend/di-containers/tokens.di-container';
import type { RemotePicturesStore } from '@/backend/stores/remote-pictures';
import {
    type UserSyndicationRequestStore,
    userSyndicationRequestStoreSchemas
} from '@/backend/stores/user-syndication-request';
import type { UserSyndicationRequestDraftStore } from '@/backend/stores/user-syndication-request-draft';
import { ZodService } from '@/backend/utils/zod-service.utils';
import type { UserSyndicationRequestModel } from '@/entities/syndication-request';
import { CommonErrorCodes } from '@/utils/error-codes';
import { userSyndicationRequestsServiceMappers } from './user-syndication-requests.service.mappers';
import { userSyndicationRequestsServiceMetadata } from './user-syndication-requests.service.metadata';

@injectable()
export class UserSyndicationRequestsService extends ZodService(userSyndicationRequestsServiceMetadata) {
    public constructor(
        @inject(DIStores.syndicationRequests) private readonly userSyndicationRequests: UserSyndicationRequestStore,
        @inject(DIStores.syndicationRequestDrafts)
        private readonly userSyndicationRequestDrafts: UserSyndicationRequestDraftStore,
        @inject(DIStores.remotePictures) private readonly remotePictures: RemotePicturesStore
    ) {
        super();
    }

    list = this.method('list', async (payload) => {
        const { listModelToServiceModel } = userSyndicationRequestsServiceMappers;

        const userId = await this.getUserId();

        const rawItems = await this.userSyndicationRequests.list(
            { ...payload, userId },
            { pageSize: 1000, zeroBasedIndex: 0 }
        );

        const items: Array<UserSyndicationRequestModel> = [];

        for (const rawItem of rawItems) {
            const { downloadLink: mainPhotoLink } = await this.remotePictures.downloadLink({
                id: rawItem.mainPhotoId
            });

            const additionalPhotoLinks: string[] = [];
            for (const additionalPhotoId of rawItem.additionalPhotoIds) {
                const { downloadLink: additionalPhotoLink } = await this.remotePictures.downloadLink({
                    id: additionalPhotoId
                });
                additionalPhotoLinks.push(additionalPhotoLink);
            }

            const item = listModelToServiceModel(rawItem, mainPhotoLink, additionalPhotoLinks);

            items.push(item);
        }

        return { items };
    });

    post = this.method('post', async (payload) => {
        const userId = await this.getUserId();
        return await this.userSyndicationRequests.create({ ...payload, userId });
    });

    postFromDraft = this.method('postFromDraft', async ({ draftId }, { methodError }) => {
        const userId = await this.getUserId();
        const data = await this.userSyndicationRequestDrafts.details({ id: draftId });

        if (!data || data.userId !== userId) {
            throw methodError(CommonErrorCodes.NO_DATA_WAS_FOUND);
        }

        if (!data.mainPhotoId && data.additionalPhotoIds?.length > 0) {
            const [mainPhoto, ...restPhotos] = data.additionalPhotoIds;
            data.mainPhotoId = mainPhoto;
            data.additionalPhotoIds = restPhotos;
        }

        const { id } = await this.userSyndicationRequests.create(
            userSyndicationRequestStoreSchemas.actionsPayload.create.parse(data)
        );

        await this.userSyndicationRequestDrafts.deleteOne({ id: data.id });

        return { id };
    });

    filters = this.method('filters', async () => {
        const userId = await this.getUserId();

        const { makes, models } = await this.userSyndicationRequests.filtersData({ userId });

        return {
            makes: [...new Set(makes)],
            models: [...new Set(models)]
        };
    });
}

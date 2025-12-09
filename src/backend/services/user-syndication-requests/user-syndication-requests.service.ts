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

    details = this.method('details', {
        handler: async ({ payload, error }) => {
            const { detailsModelToServiceModel } = userSyndicationRequestsServiceMappers;
            const item = await this.userSyndicationRequests.details(payload);
            if (!item) {
                throw error({ error: 'No request was found', details: payload });
            }
            const { downloadLink: mainPhotoLink } = await this.remotePictures.downloadLink({
                id: item.mainPhotoId
            });

            const additionalPhotoLinks: string[] = [];
            for (const additionalPhotoId of item.additionalPhotoIds) {
                const { downloadLink: additionalPhotoLink } = await this.remotePictures.downloadLink({
                    id: additionalPhotoId
                });
                additionalPhotoLinks.push(additionalPhotoLink);
            }
            return detailsModelToServiceModel(item, mainPhotoLink, additionalPhotoLinks);
        }
    });

    list = this.method('list', {
        handler: async ({ payload }) => {
            const { listModelToServiceModel } = userSyndicationRequestsServiceMappers;

            const rawItems = await this.userSyndicationRequests.list(payload, { pageSize: 1000, zeroBasedIndex: 0 });

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
        }
    });

    post = this.method('post', {
        handler: async ({ payload }) => {
            return await this.userSyndicationRequests.create(payload);
        }
    });

    filters = this.method('filters', {
        handler: async ({ payload }) => {
            const actualFilters = await this.userSyndicationRequests.filtersData(payload);
            const draftFilters = await this.userSyndicationRequestDrafts.filtersData({ userId: payload.userId! });

            return {
                makes: [...new Set([...actualFilters.makes, ...draftFilters.makes])],
                models: [...new Set([...actualFilters.models, ...draftFilters.models])]
            };
        }
    });

    createFromDraft = this.method('createFromDraft', {
        handler: async ({ payload, error }) => {
            const data = await this.userSyndicationRequestDrafts.details({ id: payload.draftId });

            if (!data) {
                throw error({ error: 'No draft was found', details: payload });
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
        }
    });

    update = this.method('update', {
        handler: async ({ payload }) => {
            await this.userSyndicationRequests.updateOne(
                { id: payload.id },
                {
                    additionalPhotoIds: payload.additionalPhotoIds,
                    mainPhotoId: payload.mainPhotoId,
                    status: payload.status,
                    marketplaceLinks: payload.marketplaceLinks
                }
            );
            return {};
        }
    });
}

import { inject, injectable } from 'inversify';
import { DIStores } from '@/backend/di-containers/tokens.di-container';
import type { RemotePicturesStore } from '@/backend/stores/remote-pictures';
import type { UserSyndicationRequestStore } from '@/backend/stores/user-syndication-request';
import { ZodService } from '@/backend/utils/zod-service.utils';
import type { UserSyndicationRequestModel } from '@/entities/syndication-request';
import { Pagination } from '@/utils/entities/pagination';
import { CommonErrorCodes } from '@/utils/error-codes';
import { syndicationRequestsManagementServiceMappers } from './syndication-requests-management.service.mappers';
import { syndicationRequestsManagementServiceMetadata } from './syndication-requests-management.service.metadata';

@injectable()
export class SyndicationRequestsManagementService extends ZodService(syndicationRequestsManagementServiceMetadata) {
    constructor(
        @inject(DIStores.syndicationRequests) private readonly userSyndicationRequests: UserSyndicationRequestStore,
        @inject(DIStores.remotePictures) private readonly remotePictures: RemotePicturesStore
    ) {
        super();
    }

    list = this.method('list', async (payload) => {
        const { listModelToServiceModel } = syndicationRequestsManagementServiceMappers;

        const rawItems = await this.userSyndicationRequests.list(payload, Pagination.onePageRequest);

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

    details = this.method('details', async (payload, { methodError }) => {
        const { detailsModelToServiceModel } = syndicationRequestsManagementServiceMappers;
        const item = await this.userSyndicationRequests.details(payload);
        if (!item) {
            throw methodError(CommonErrorCodes.NO_DATA_WAS_FOUND);
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
    });

    filters = this.method('filters', async () => {
        const { makes, models } = await this.userSyndicationRequests.filtersData({});

        return {
            makes: [...new Set(makes)],
            models: [...new Set(models)]
        };
    });

    update = this.method('update', async (payload, { methodError }) => {
        const data = await this.userSyndicationRequests.details({ id: payload.id });
        if (!data) {
            throw methodError(CommonErrorCodes.NO_DATA_WAS_FOUND);
        }
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
    });
}

import { inject, injectable } from 'inversify';
import { DIStores } from '@/backend/di-containers/tokens.di-container';
import type { RemotePicturesStore } from '@/backend/stores/remote-pictures';
import type { UserSyndicationRequestDraftStore } from '@/backend/stores/user-syndication-request-draft';
import { ZodService } from '@/backend/utils/zod-service.utils';
import { Pagination } from '@/utils/entities/pagination';
import { CommonErrorCodes } from '@/utils/error-codes';
import { userSyndicationRequestDraftsServiceMappers } from './user-syndication-request-drafts.service.mappers';
import {
    type UserSyndicationRequestDraftsServiceDTOs,
    userSyndicationRequestDraftsServiceMetadata
} from './user-syndication-request-drafts.service.metadata';

@injectable()
export class UserSyndicationRequestDraftsService extends ZodService(userSyndicationRequestDraftsServiceMetadata) {
    public constructor(
        @inject(DIStores.syndicationRequestDrafts)
        private readonly userSyndicationRequestDrafts: UserSyndicationRequestDraftStore,
        @inject(DIStores.remotePictures) private readonly remotePictures: RemotePicturesStore
    ) {
        super();
    }

    details = this.method('details', async ({ id }, { methodError }) => {
        const { listModelToServiceModel } = userSyndicationRequestDraftsServiceMappers;
        const userId = await this.getUserId();
        const item = await this.userSyndicationRequestDrafts.details({ id });
        if (!item || item.userId !== userId) {
            throw methodError(CommonErrorCodes.NO_DATA_WAS_FOUND);
        }

        let mainPhotoLink: string | undefined;
        const additionalPhotoLinks: { id: string; url: string }[] = [];
        if (item.mainPhotoId) {
            const { downloadLink } = await this.remotePictures.downloadLink({ id: item.mainPhotoId });
            mainPhotoLink = downloadLink;
        }
        for (const additionalPhotoId of item.additionalPhotoIds) {
            const { downloadLink } = await this.remotePictures.downloadLink({ id: additionalPhotoId });
            additionalPhotoLinks.push({ id: additionalPhotoId, url: downloadLink });
        }
        return listModelToServiceModel(item, mainPhotoLink, additionalPhotoLinks);
    });

    list = this.method('list', async (searchPayload) => {
        const { listModelToServiceModel } = userSyndicationRequestDraftsServiceMappers;
        const userId = await this.getUserId();

        const rawItems = await this.userSyndicationRequestDrafts.list(
            {
                ...searchPayload,
                userId
            },
            Pagination.onePageRequest
        );

        const items: UserSyndicationRequestDraftsServiceDTOs['listResponse']['items'] = [];

        for (const rawItem of rawItems) {
            let mainPhotoLink: string | undefined;
            const additionalPhotoLinks: { id: string; url: string }[] = [];
            if (rawItem.mainPhotoId) {
                const { downloadLink } = await this.remotePictures.downloadLink({ id: rawItem.mainPhotoId });
                mainPhotoLink = downloadLink;
            }
            for (const additionalPhotoId of rawItem.additionalPhotoIds) {
                const { downloadLink } = await this.remotePictures.downloadLink({ id: additionalPhotoId });
                additionalPhotoLinks.push({ id: additionalPhotoId, url: downloadLink });
            }
            items.push(listModelToServiceModel(rawItem, mainPhotoLink, additionalPhotoLinks));
        }

        return { items };
    });

    post = this.method('post', async (creationPayload) => {
        const userId = await this.getUserId();

        return await this.userSyndicationRequestDrafts.create({
            ...creationPayload,
            userId
        });
    });

    update = this.method('update', async (payload, { methodError }) => {
        const userId = await this.getUserId();

        const itemToUpdate = await this.userSyndicationRequestDrafts.details({ id: payload.id });

        if (!itemToUpdate || itemToUpdate.userId !== userId) {
            throw methodError(CommonErrorCodes.NO_DATA_WAS_FOUND);
        }

        const actualPhotoIds = [
            ...itemToUpdate.additionalPhotoIds.filter((x) => !payload.photoIdsToBeRemoved.includes(x)),
            ...(payload.additionalPhotoIds ?? [])
        ];

        await this.userSyndicationRequestDrafts.updateOne(
            { id: payload.id },
            {
                additionalPhotoIds: actualPhotoIds,
                make: payload.make,
                mileage: payload.mileage,
                mainPhotoId: payload.mainPhotoId,
                model: payload.model,
                price: payload.price,
                vin: payload.vin,
                year: payload.year
            }
        );

        return {};
    });

    filters = this.method('filters', async () => {
        const userId = await this.getUserId();
        const { makes, models } = await this.userSyndicationRequestDrafts.filtersData({ userId });

        // TODO - перенести проверку на уникальность айтемов на уровень стора
        return { makes: [...new Set(makes)], models: [...new Set(models)] };
    });
}

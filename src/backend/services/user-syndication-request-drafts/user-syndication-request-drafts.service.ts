import { inject, injectable } from 'inversify';
import { DIStores } from '@/backend/di-containers/tokens.di-container';
import type { RemotePicturesStore } from '@/backend/stores/remote-pictures';
import type { UserSyndicationRequestDraftStore } from '@/backend/stores/user-syndication-request-draft';
import { ZodService } from '@/backend/utils/zod-service.utils';
import { Pagination } from '@/utils/entities/pagination';
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

    details = this.method('details', {
        handler: async ({ payload, error }) => {
            const { listModelToServiceModel } = userSyndicationRequestDraftsServiceMappers;

            const item = await this.userSyndicationRequestDrafts.details({
                id: payload.id
            });

            if (!item) {
                throw error({ error: 'No draft was found', details: payload });
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
        }
    });

    list = this.method('list', {
        handler: async ({ payload }) => {
            const { listModelToServiceModel } = userSyndicationRequestDraftsServiceMappers;

            const rawItems = await this.userSyndicationRequestDrafts.list(payload, Pagination.onePageRequest);

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
        }
    });

    post = this.method('post', {
        handler: async ({ payload }) => {
            console.log(payload);
            return await this.userSyndicationRequestDrafts.create(payload);
        }
    });

    update = this.method('update', {
        handler: async ({ payload, error }) => {
            const data = await this.userSyndicationRequestDrafts.details({ id: payload.id });

            if (!data) {
                throw error({ error: 'No draft to update was found!', details: payload });
            }

            const actualPhotoIds = [
                ...data.additionalPhotoIds.filter((x) => !payload.photoIdsToBeRemoved.includes(x)),
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
        }
    });
}

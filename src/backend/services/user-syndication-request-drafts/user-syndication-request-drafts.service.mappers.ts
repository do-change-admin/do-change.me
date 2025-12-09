import type { UserSyndicationRequestDraftStore } from '@/backend/stores/user-syndication-request-draft';
import type { StoreTypes } from '@/backend/utils/store/store.shared-models.utils';
import type { UserSyndicationRequestDraftsServiceDTOs } from './user-syndication-request-drafts.service.metadata';

export const userSyndicationRequestDraftsServiceMappers = {
    listModelToServiceModel: (
        source: StoreTypes<UserSyndicationRequestDraftStore>['listModel'],
        mainPhotoLink: string | undefined,
        additionalPhotoLinks: { id: string; url: string }[] | undefined
    ): UserSyndicationRequestDraftsServiceDTOs['listResponse']['items'][number] => {
        return {
            mainPhotoLink,
            currentPhotos: additionalPhotoLinks ?? [],
            id: source.id,
            userId: source.userId,
            make: source.make,
            mileage: source.mileage,
            model: source.model,
            price: source.price,
            vin: source.vin,
            year: source.year
        };
    },

    detailsModelToServiceModel: (
        source: StoreTypes<UserSyndicationRequestDraftStore>['details'],
        mainPhotoLink: string | undefined,
        additionalPhotoLinks: { id: string; url: string }[] | undefined
    ): UserSyndicationRequestDraftsServiceDTOs['detailsResponse'] => {
        return {
            mainPhotoLink,
            currentPhotos: additionalPhotoLinks ?? [],
            id: source.id,
            userId: source.userId,
            make: source.make,
            mileage: source.mileage,
            model: source.model,
            price: source.price,
            vin: source.vin,
            year: source.year
        };
    }
};

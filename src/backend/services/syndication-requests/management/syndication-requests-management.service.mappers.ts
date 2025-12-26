import type { UserSyndicationRequestStore } from '@/backend/stores/user-syndication-request';
import type { StoreTypes } from '@/backend/utils/store/store.shared-models.utils';
import type { UserSyndicationRequestModel } from '@/entities/syndication-request';

export const syndicationRequestsManagementServiceMappers = {
    listModelToServiceModel: (
        source: StoreTypes<UserSyndicationRequestStore>['listModel'],
        mainPhotoLink: string,
        additionalPhotoLinks: string[]
    ): UserSyndicationRequestModel => {
        return {
            mainPhotoLink,
            additionalPhotoLinks,
            id: source.id,
            make: source.make,
            marketplaceLinks: source.marketplaceLinks,
            mileage: source.mileage,
            model: source.model,
            price: source.price,
            status: source.status,
            userId: source.userId,
            userMail: source.userMail,
            vin: source.vin,
            year: source.year
        };
    },

    detailsModelToServiceModel: (
        source: StoreTypes<UserSyndicationRequestStore>['details'],
        mainPhotoLink: string,
        additionalPhotoLinks: string[]
    ): UserSyndicationRequestModel => {
        return {
            mainPhotoLink,
            additionalPhotoLinks,
            id: source.id,
            make: source.make,
            marketplaceLinks: source.marketplaceLinks,
            mileage: source.mileage,
            model: source.model,
            price: source.price,
            status: source.status,
            userId: source.userId,
            userMail: source.userMail,
            vin: source.vin,
            year: source.year
        };
    }
};

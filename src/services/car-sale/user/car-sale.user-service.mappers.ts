import { CarForSaleUserDetailModel, CarForSaleUserDraftModel, CarForSaleUserListModel } from "@/entities";
import { CarForSaleDetailDataLayerModel, CarForSaleListDataLayerModel } from "@/providers";

export const mapCarForSaleListDataLayerToUserEntity = (
    source: CarForSaleListDataLayerModel,
    photoLinks: string[]
): CarForSaleUserListModel => {
    return {
        id: source.id,
        make: source.make,
        marketplaceLinks: source.marketplaceLinks,
        mileage: source.mileage,
        model: source.model,
        photoLinks,
        price: source.price,
        status: source.status,
        vin: source.vin,
        year: source.year
    }
}

export const mapCarForSaleDetailDataLayerToUserDraftEntity = (
    source: CarForSaleDetailDataLayerModel,
    photoLinks: string[] | undefined
): CarForSaleUserDraftModel => {
    return {
        id: source.id,
        photoLinks,
        make: source.make || undefined,
        marketplaceLinks: source.marketplaceLinks || undefined,
        mileage: source.mileage || undefined,
        model: source.model || undefined,
        price: source.price || undefined,
        status: 'draft',
        vin: source.vin || undefined,
        year: source.year || undefined
    }
}
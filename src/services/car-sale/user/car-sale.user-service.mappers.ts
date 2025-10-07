import { CarForSaleUserDraftModel, CarForSaleUserListModel } from "@/entities";
import { DataProviders } from "@/providers";


export const mapListDataLayerToDomain = (
    source: DataProviders.CarsForSale.ListModel,
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

export const mapDetailDataLayerToDraft = (
    source: DataProviders.CarsForSale.Details,
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
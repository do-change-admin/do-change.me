import { CarForSaleUserListModel } from "@/entities";
import { CarForSaleListDataLayerModel } from "@/providers";

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
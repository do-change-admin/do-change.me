import { CarForSaleAdminDetailModel, CarForSaleAdminListModel } from "@/entities";
import { DataProviders } from "@/providers";

export const mapDetailDataLayerToAdminEntity = (
    source: DataProviders.CarsForSale.Details,
    photoLinks: string[]
): CarForSaleAdminDetailModel => {
    return {
        id: source.id,
        make: source.make,
        marketplaceLinks: source.marketplaceLinks,
        mileage: source.mileage,
        model: source.model,
        photoLinks: photoLinks,
        price: source.price,
        status: source.status,
        userId: source.userId,
        userMail: source.userMail,
        vin: source.vin,
        year: source.year
    }
}

export const mapCarForSaleListDataLayerToAdminEntity = (
    source: DataProviders.CarsForSale.ListModel
): CarForSaleAdminListModel => {
    return {
        id: source.id,
        price: source.price,
        status: source.status,
        userId: source.userId,
        userMail: source.userMail,
        vin: source.vin,
        make: source.make,
        model: source.model
    }
}
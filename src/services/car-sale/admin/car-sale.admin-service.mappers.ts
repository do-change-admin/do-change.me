import { CarForSaleAdminDetailModel, CarForSaleAdminListModel } from "@/entities";
import { CarForSaleDetailDataLayerModel, CarForSaleListDataLayerModel } from "@/providers";

export const mapCarForSaleDetailDataLayerToAdminEntity = (
    source: CarForSaleDetailDataLayerModel,
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
    source: CarForSaleListDataLayerModel
): CarForSaleAdminListModel => {
    return {
        id: source.id,
        price: source.price,
        status: source.status,
        userId: source.userId,
        userMail: source.userMail,
        vin: source.vin
    }
}
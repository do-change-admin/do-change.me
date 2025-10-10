import { inject, injectable } from "inversify";
import { type DataProviders } from "@/providers";
import { FindListPayload, FindDetailsPayload, UpdatePayload } from "./car-sale.admin-service.models";
import { CarForSaleAdminDetailModel, CarForSaleAdminListModel } from "@/entities";
import { businessError } from "@/lib/errors";
import { DataProviderTokens } from "@/di-containers/tokens.di-container";
import { mapDetailDataLayerToAdminEntity, mapCarForSaleListDataLayerToAdminEntity } from "./car-sale.admin-service.mappers";

@injectable()
export class Instance {
    public constructor(
        @inject(DataProviderTokens.carsForSale) private readonly dataProvider: DataProviders.CarsForSale.Interface,
        @inject(DataProviderTokens.pictures) private readonly picturesDataProvider: DataProviders.Pictures.Interface
    ) { }

    list = async (payload: FindListPayload): Promise<CarForSaleAdminListModel[]> => {
        const items = await this.dataProvider.list({
            status: payload.status,
            userId: payload.userId,
            model: payload.model,
            make: payload.make,
            vin: payload.vin
        }, {
            pageSize: payload.pageSize,
            zeroBasedIndex: payload.zeroBasedIndex
        })

        return items.map(mapCarForSaleListDataLayerToAdminEntity)
    }

    details = async (payload: FindDetailsPayload): Promise<CarForSaleAdminDetailModel> => {
        const details = await this.dataProvider.details(payload)

        if (!details) {
            throw businessError('No according car for sale was found!', undefined, 404)
        }

        let photoLinks: string[] = []

        for (const photoId of details.photoIds) {
            const picture = await this.picturesDataProvider.findOne(photoId)
            if (picture) {
                photoLinks.push(picture.src)
            }
        }

        return mapDetailDataLayerToAdminEntity(details, photoLinks)
    }

    update = async ({ carId, payload, userId }: UpdatePayload) => {
        await this.dataProvider.updateOne({
            id: carId,
            userId: userId
        }, payload)
    }
}
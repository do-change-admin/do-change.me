import { inject, injectable } from "inversify";
import { type CarsForSaleDataProvider } from "@/providers";
import { FindListPayload, FindDetailsPayload, UpdatePayload } from "./car-sale.admin-service.models";
import { CarForSaleAdminDetailModel, CarForSaleAdminListModel } from "@/entities";
import { businessError } from "@/lib/errors";
import { type FileSystemProvider } from "@/providers/contracts";
import { DataProviderTokens, FunctionalProviderTokens } from "@/di-containers/tokens.di-container";
import { mapCarForSaleDetailDataLayerToAdminEntity, mapCarForSaleListDataLayerToAdminEntity } from "./car-sale.admin-service.mappers";

@injectable()
export class Instance {
    public constructor(
        @inject(DataProviderTokens.carsForSale) private readonly dataProvider: CarsForSaleDataProvider,
        @inject(FunctionalProviderTokens.fileSystem) private readonly fileSystemProvider: FileSystemProvider
    ) { }

    list = async (payload: FindListPayload): Promise<CarForSaleAdminListModel[]> => {
        const items = await this.dataProvider.list({
            status: payload.status,
            userId: payload.userId,
            model: payload.model,
            make: payload.make
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
            const link = await this.fileSystemProvider.obtainDownloadLink(photoId)
            if (link) {
                photoLinks = [link, ...photoLinks]
            }
        }

        return mapCarForSaleDetailDataLayerToAdminEntity(details, photoLinks)
    }

    update = async ({ carId, payload, userId }: UpdatePayload) => {
        await this.dataProvider.updateOne({
            id: carId,
            userId: userId
        }, payload)
    }
}
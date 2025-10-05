import { type CarsForSaleDataProvider } from "@/providers";
import { FindCarsForSaleUserServicePayload, PostCarForSaleUserServicePayload } from "./car-sale.user-service.models";
import { CarForSaleUserListModel } from "@/entities";
import { type FileSystemProvider } from "@/providers/contracts";
import { v4 } from "uuid";
import { inject, injectable } from "inversify";
import { DataProviderTokens, FunctionalProviderTokens } from "@/di-containers/tokens.di-container";
import { mapCarForSaleListDataLayerToUserEntity } from "./car-sale.user-service.mappers";

@injectable()
export class CarSaleUserService {
    public constructor(
        @inject(DataProviderTokens.carsForSale) private readonly dataProvider: CarsForSaleDataProvider,
        @inject(FunctionalProviderTokens.fileSystem) private readonly fileSystemProvider: FileSystemProvider,
        private readonly userId: string
    ) {

    }

    public findList = async (payload: FindCarsForSaleUserServicePayload): Promise<CarForSaleUserListModel[]> => {
        const result = await this.dataProvider.list({
            userId: this.userId,
            status: payload.status,
            make: payload.make,
            model: payload.model
        }, {
            pageSize: payload.pageSize,
            zeroBasedIndex: payload.zeroBasedIndex,
        })

        const items = await Promise.all(result.map(async (x) => {
            let photoLinks: string[] = []

            for (const photoId of x.photoIds) {
                const photoLink = await this.fileSystemProvider.obtainDownloadLink(photoId);
                if (photoLink) {
                    photoLinks = [photoLink, ...photoLinks]
                }
            }

            return mapCarForSaleListDataLayerToUserEntity(x, photoLinks)
        }))

        return items
    }


    public post = async (payload: PostCarForSaleUserServicePayload) => {
        let photoIds: string[] = []

        for (const photo of payload.photos) {
            const id = `${v4()}-${photo.name}`
            await this.fileSystemProvider.upload(photo, id, photo.name)
            photoIds.push(id)
        }

        await this.dataProvider.create({
            make: payload.make,
            mileage: payload.mileage,
            model: payload.model,
            photoIds,
            price: payload.price,
            vin: payload.vin,
            userId: this.userId,
            year: payload.year
        })
    }
}
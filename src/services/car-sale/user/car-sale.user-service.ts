import { type CarsForSaleDataProvider } from "@/providers";
import { CreateDraftPayload, FindCarsPayload, FindDraftPayload, PostCarPayload, UpdateDraftPayload } from "./car-sale.user-service.models";
import { CarForSaleUserDraftModel, CarForSaleUserListModel } from "@/entities";
import { type FileSystemProvider } from "@/providers/contracts";
import { v4 } from "uuid";
import { inject, injectable } from "inversify";
import { DataProviderTokens, FunctionalProviderTokens } from "@/di-containers/tokens.di-container";
import { mapDetailDataLayerToDraft, mapListDataLayerToDomain } from "./car-sale.user-service.mappers";
import { businessError } from "@/lib/errors";

@injectable()
export class Instance {
    public constructor(
        @inject(DataProviderTokens.carsForSale) private readonly dataProvider: CarsForSaleDataProvider,
        @inject(FunctionalProviderTokens.fileSystem) private readonly fileSystemProvider: FileSystemProvider,
        private readonly userId: string
    ) {

    }

    public findList = async (payload: FindCarsPayload): Promise<CarForSaleUserListModel[]> => {
        const result = await this.dataProvider.list({
            userId: this.userId,
            status: payload.status,
            make: payload.make,
            model: payload.model,
            vin: payload.vin
        }, {
            pageSize: payload.pageSize,
            zeroBasedIndex: payload.zeroBasedIndex,

        })

        const items = await Promise.all(result.map(async (x) => {
            let photoLinks: string[] = []

            for (const photoId of x.photoIds) {
                const photoLink = await this.fileSystemProvider.obtainDownloadLink(photoId);
                if (photoLink) {
                    photoLinks.push(photoLink)
                }
            }

            return mapListDataLayerToDomain(x, photoLinks)
        }))

        return items
    }


    public post = async (payload: PostCarPayload) => {
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

        if (payload.draftId) {
            await this.dataProvider.deleteOne({
                id: payload.draftId,
                userId: this.userId
            })
        }
    }

    public findDraft = async (payload: FindDraftPayload): Promise<CarForSaleUserDraftModel> => {
        const data = await this.dataProvider.details({ id: payload.id, userId: this.userId })
        if (!data || data.status !== 'draft') {
            throw businessError('No such draft was found', undefined, 404)
        }
        let photoLinks: string[] | undefined = []
        if (!data.photoIds || !data.photoIds.length) {
            photoLinks = undefined
        }

        for (const photoId of (data.photoIds || [])) {
            const link = await this.fileSystemProvider.obtainDownloadLink(photoId)
            if (link) {
                photoLinks!.push(link)
            }
        }

        return mapDetailDataLayerToDraft(data, photoLinks)
    }

    public createDraft = async (payload: CreateDraftPayload) => {
        let photoIds = []

        if (payload.photos && payload.photos.length) {
            for (const photo of payload.photos) {
                const id = `${v4()}-${photo.name}`
                await this.fileSystemProvider.upload(photo, id, photo.name)
                photoIds.push(id)
            }
        }

        await this.dataProvider.create({
            make: payload.make || '',
            mileage: payload.mileage || 0,
            model: payload.model || '',
            photoIds,
            price: payload.price || 0,
            userId: this.userId,
            vin: payload.vin || '',
            year: payload.year || 0
        })
    }

    public updateDraft = async (payload: UpdateDraftPayload) => {

    }
}
import { StoreTokens } from "@/backend/di-containers/tokens.di-container";
import { SyndicationRequestStatus } from "@/entities/sindycation-request-status.entity";
import { SyndicationRequest } from "@/entities/syndication-request.entity";
import { DataProviders } from "@/backend/providers";
import { inject, injectable } from "inversify";
import z from "zod";
import type { Pictures } from "../stores/interfaces/picture.store.interface";

type DataListModel = DataProviders.SyndicationRequests.ListModel;
type CreateDataPayload = DataProviders.SyndicationRequests.CreatePayload;
type FindListPayload = DataProviders.SyndicationRequests.FindListPayload;

@injectable()
export class SyndicationRequestsService {
    static dtoSchema = SyndicationRequest.modelShema.omit({
        userMail: true,
        userId: true,
    }).extend({
        status: SyndicationRequestStatus.nameSchema
    })

    public constructor(
        @inject(StoreTokens.syndicationRequests) private readonly data: DataProviders.SyndicationRequests.Interface,
        @inject(StoreTokens.syndicationRequestDrafts) private readonly drafts: DataProviders.SyndicationRequestDrafts.Interface,
        @inject(StoreTokens.pictures) private readonly pictures: Pictures,
        private readonly userId: string
    ) { }

    list = async (
        payload: Omit<FindListPayload, 'userId'>
    ): Promise<SyndicationRequestDTO[]> => {
        const data = await this.data.list(
            { userId: this.userId, ...payload },
            { pageSize: 100, zeroBasedIndex: 0 }
        )

        const items = await Promise.all(data.map(async (x) => {
            let photoLinks: string[] = []

            for (const photoId of x.photoIds) {
                const photo = await this.pictures.findOne(photoId);
                if (photo) {
                    photoLinks.push(photo.src)
                }
            }

            return mapFromDataLayer(x, photoLinks)
        }))

        return items
    }

    post = async (payload: Omit<CreateDataPayload, 'userId' | 'photoIds'> & { photos: File[] }) => {
        let photoIds: string[] = []

        for (const photo of payload.photos) {
            const { id, success } = await this.pictures.add(photo)
            if (success) {
                photoIds.push(id)
            }
        }

        const { id } = await this.data.create({
            userId: this.userId,
            photoIds,
            ...payload
        })

        return { id }
    }

    allFilters = async () => {
        const activeFilters = await this.data.filtersData(this.userId)
        const draftFilters = await this.drafts.filtersData(this.userId)

        return {
            models: [...new Set([...activeFilters.models, ...draftFilters.models])],
            makes: [...new Set([...activeFilters.makes, ...draftFilters.makes])]
        }
    }
}

export type SyndicationRequestDTO = z.infer<typeof SyndicationRequestsService.dtoSchema>

const mapFromDataLayer = (model: DataListModel, photoLinks: string[]): SyndicationRequestDTO => {
    return {
        id: model.id,
        make: model.make,
        marketplaceLinks: model.marketplaceLinks,
        mileage: model.mileage,
        model: model.model,
        photoLinks: photoLinks,
        price: model.price,
        status: model.status,
        vin: model.vin,
        year: model.year
    }
}
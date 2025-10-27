import { StoreTokens } from "@/backend/di-containers/tokens.di-container";
import { VIN } from "@/value-objects/vin.value-object";
import { SyndicationRequestDraft } from "@/entities/syndication-request-draft.entity";
import { DataProviders } from "@/backend/providers";
import { inject, injectable } from "inversify";
import z from "zod";
import type { Pictures } from "../stores/interfaces/picture.store.interface";

type DataListModel = DataProviders.SyndicationRequestDrafts.ListModel;
type CreateDataPayload = DataProviders.SyndicationRequestDrafts.CreatePayload;
type FindDataListPayload = DataProviders.SyndicationRequestDrafts.FindListPayload;
type UpdateDataPayload = DataProviders.SyndicationRequestDrafts.UpdatePayload

type CreateRequestPayload = DataProviders.SyndicationRequests.CreatePayload

@injectable()
export class SyndicationRequestDraftsService {
    static dtoSchema = SyndicationRequestDraft.modelSchema.omit({
        userId: true,
        photoLinks: true
    }).extend({
        currentPhotos: z.array(
            z.object({
                id: z.string().nonempty(),
                url: z.url()
            })
        )
    })

    public constructor(
        @inject(StoreTokens.syndicationRequestDrafts) private readonly data: DataProviders.SyndicationRequestDrafts.Interface,
        @inject(StoreTokens.syndicationRequests) private readonly requests: DataProviders.SyndicationRequests.Interface,
        @inject(StoreTokens.pictures) private readonly pictures: Pictures,
        private readonly userId: string,
    ) { }

    list = async (payload: Omit<FindDataListPayload, 'userId'>): Promise<SyndicationRequestDraftDTO[]> => {
        const data = await this.data.list(
            { userId: this.userId, ...payload },
            { pageSize: 100, zeroBasedIndex: 0 }
        )
        const items = await Promise.all(data.map(async (x) => {
            let photoData = [] as { id: string, url: string }[]
            for (const photoId of (x.photoIds ?? [])) {
                const photo = await this.pictures.findOne(photoId);
                if (photo) {
                    photoData.push({ url: photo.src, id: photoId })
                }
            }

            return mapFromDataLayer(x, photoData)
        }))

        return items
    }

    details = async (id: string): Promise<SyndicationRequestDraftDTO> => {
        const data = await this.data.details({ id, userId: this.userId })
        if (!data) {
            throw 'Not found'
        }
        let photoData = [] as { id: string, url: string }[]
        for (const photoId of (data.photoIds ?? [])) {
            const photo = await this.pictures.findOne(photoId);
            if (photo) {
                photoData.push({ url: photo.src, id: photoId })
            }
        }

        return mapFromDataLayer(data, photoData)
    }

    post = async (payload: Omit<CreateDataPayload, 'userId' | 'photoIds'> & { photos?: File[] }) => {
        let photoIds: string[] = []

        for (const photo of (payload.photos ?? [])) {
            const { id, success } = await this.pictures.add(photo)
            if (success) {
                photoIds.push(id)
            }
        }

        return await this.data.create({
            userId: this.userId,
            photoIds: photoIds.length > 0 ? photoIds : undefined,
            ...payload
        })
    }

    update = async (payload: Omit<UpdateDataPayload, 'photoIds'> & { id: string, photos?: File[], photoIdsToBeRemoved?: string[] }) => {
        const data = await this.data.details({
            id: payload.id,
            userId: this.userId
        })

        if (!data) {
            throw 'Not found'
        }

        let photoIds: string[] = (data.photoIds ?? []).filter(x => !(payload.photoIdsToBeRemoved ?? []).includes(x))

        for (const photo of (payload.photos ?? [])) {
            const { id, success } = await this.pictures.add(photo)
            if (success) {
                photoIds.push(id)
            }
        }

        return await this.data.updateOne({
            id: payload.id,
            userId: this.userId
        }, {
            make: payload.make,
            mileage: payload.mileage,
            model: payload.model,
            photoIds: photoIds.length > 0 ? photoIds : undefined,
            price: payload.price,
            vin: payload.vin,
            year: payload.year
        })

    }

    createRequest = async (draftId: string) => {
        const item = await this.data.details({
            id: draftId,
            userId: this.userId
        })
        if (!item) {
            throw 'Not found'
        }
        const creationPayload = mapToCreationPayload(item)

        const requestId = await this.requests.create(creationPayload)

        await this.data.deleteOne({
            id: item.id,
            userId: item.userId
        })

        return requestId
    }
}

export type SyndicationRequestDraftDTO = z.infer<typeof SyndicationRequestDraftsService.dtoSchema>

const mapFromDataLayer = (data: DataListModel, photoData: { id: string, url: string }[]): SyndicationRequestDraftDTO => {
    return {
        id: data.id,
        make: data.make,
        mileage: data.mileage,
        model: data.model,
        currentPhotos: photoData,
        price: data.price,
        vin: data.vin,
        year: data.year
    }
}

const mapToCreationPayload = (item: DataListModel): CreateRequestPayload => {
    const validitySchema = z.object({
        make: z.string().nonempty(),
        mileage: z.coerce.number(),
        model: z.string().nonempty(),
        photoIds: z.array(z.string().nonempty()).nonempty(),
        price: z.coerce.number(),
        userId: z.string().nonempty(),
        vin: VIN.schema,
        year: z.coerce.number()
    })

    return validitySchema.parse(item)
}
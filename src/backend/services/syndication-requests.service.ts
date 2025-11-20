import { StoreTokens } from "@/backend/di-containers/tokens.di-container";
import { SyndicationRequestStatus } from "@/entities/sindycation-request-status.entity";
import { SyndicationRequest } from "@/entities/syndication-request.entity";
import { DataProviders } from "@/backend/providers";
import { inject, injectable } from "inversify";
import z from "zod";
import { ZodService, ZodServiceSchemas } from "../utils/zod-service.utils";

type DataListModel = DataProviders.SyndicationRequests.ListModel;
type CreateDataPayload = DataProviders.SyndicationRequests.CreatePayload;
type FindListPayload = DataProviders.SyndicationRequests.FindListPayload;

export const syndicationRequestsServiceSchemas = {
    addPhotos: {
        payload: z.object({
            photos: z.any(),
            id: z.string().nonempty()
        }),
        response: z.object({})
    }
} satisfies ZodServiceSchemas

@injectable()
export class SyndicationRequestsService extends ZodService('Syndication requests', syndicationRequestsServiceSchemas) {
    static dtoSchema = SyndicationRequest.modelShema.omit({
        userMail: true,
        userId: true,
    }).extend({
        status: SyndicationRequestStatus.nameSchema
    })

    public constructor(
        @inject(StoreTokens.syndicationRequests) private readonly data: DataProviders.SyndicationRequests.Interface,
        @inject(StoreTokens.syndicationRequestDrafts) private readonly drafts: DataProviders.SyndicationRequestDrafts.Interface,
        @inject(StoreTokens.reserve_pictures) private readonly pictures: DataProviders.Pictures.Interface,
        private readonly userId: string
    ) {
        super()
    }


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

    addPhotos = this.method('addPhotos', {
        handler: async ({ payload: { id, photos }, serviceError }) => {
            console.log("HERE 1")
            const details = await this.data.details({
                id,
                userId: this.userId
            })

            console.log(details, "details")
            if (!details) {
                throw serviceError({ error: 'No request was found', details: { id, userId: this.userId } })
            }

            let newPhotoIds = [] as string[]
            console.log(photos)

            for (const photo of photos) {
                console.log("SSS")
                const { id, success } = await this.pictures.add(photo)
                console.log(id, success)
                if (success) {
                    newPhotoIds.push(id)
                }
            }

            await this.data.updateOne({
                id,
                userId: this.userId
            }, {
                photoIds: newPhotoIds
            })

            return {}
        }
    })

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
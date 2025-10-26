import { StoreTokens } from "@/backend/di-containers/tokens.di-container";
import { SyndicationRequestActiveStatusNames, SyndicationRequestStatus } from "@/entities/sindycation-request-status.entity";
import { SyndicationRequest } from "@/entities/syndication-request.entity";
import { DataProviders } from "@/backend/providers";
import { inject, injectable } from "inversify";
import z from "zod";

type DataListModel = DataProviders.SyndicationRequests.ListModel
type FindDataPayload = DataProviders.SyndicationRequests.FindListPayload
type UpdatePayload = DataProviders.SyndicationRequests.UpdatePayload

@injectable()
export class SyndicationRequestManagementService {
    static dtoSchema = SyndicationRequest.modelShema

    public constructor(
        @inject(StoreTokens.syndicationRequests) private readonly data: DataProviders.SyndicationRequests.Interface,
        @inject(StoreTokens.pictures) private readonly pictures: DataProviders.Pictures.Interface,
    ) { }

    requests = async (
        payload: Omit<FindDataPayload, 'userId' | 'status'> & { status: SyndicationRequestActiveStatusNames }
    ): Promise<SyndicationRequestAdminDTO[]> => {
        const data = await this.data.list(payload, { pageSize: 100, zeroBasedIndex: 0 })

        const items = await Promise.all(data.map(async (x) => {
            let photoLinks: string[] = []

            for (const photoId of (x.photoIds ?? [])) {
                const photo = await this.pictures.findOne(photoId);
                if (photo) {
                    photoLinks.push(photo.src)
                }
            }

            return mapFromDataLayer(x, photoLinks)
        }))

        return items
    }

    requestDetails = async (id: string, userId: string): Promise<SyndicationRequestAdminDTO> => {
        const data = await this.data.details({ id, userId })
        if (!data) {
            throw 'Not found'
        }
        let photoLinks = []
        for (const photoId of (data.photoIds ?? [])) {
            const photo = await this.pictures.findOne(photoId);
            if (photo) {
                photoLinks.push(photo.src)
            }
        }

        return mapFromDataLayer(data, photoLinks)
    }

    updateRequest = async (payload: UpdatePayload & { id: string, userId: string }) => {
        return await this.data.updateOne({
            id: payload.id,
            userId: payload.userId
        }, {
            marketplaceLinks: payload.marketplaceLinks,
            status: payload.status
        })
    }

    allFilters = async () => {
        return await this.data.filtersData()
    }
}

export type SyndicationRequestAdminDTO = z.infer<typeof SyndicationRequestManagementService.dtoSchema>

const mapFromDataLayer = (source: DataListModel, photoLinks: string[]): SyndicationRequestAdminDTO => {
    return {
        id: source.id,
        make: source.make,
        marketplaceLinks: source.marketplaceLinks,
        mileage: source.mileage,
        model: source.model,
        photoLinks,
        userId: source.userId,
        price: source.price,
        status: source.status,
        userMail: source.userMail,
        vin: source.vin,
        year: source.year
    }
} 
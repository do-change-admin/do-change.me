import z from "zod";
import { SyndicationRequest } from "./syndication-request.entity";

export class SyndicationRequestDraft {
    static modelSchema = SyndicationRequest.modelShema
        .omit({
            marketplaceLinks: true,
            status: true,
            userMail: true
        })
        .partial({
            make: true,
            mileage: true,
            model: true,
            photoLinks: true,
            price: true,
            vin: true,
            year: true
        })

    private constructor(private readonly data: SyndicationRequestDraftModel) { }

    static create = (payload: SyndicationRequestDraftModel) => {
        return new SyndicationRequestDraft(payload)
    }

    get model(): SyndicationRequestDraftModel {
        return this.data
    }
}

export type SyndicationRequestDraftModel = z.infer<typeof SyndicationRequestDraft.modelSchema>
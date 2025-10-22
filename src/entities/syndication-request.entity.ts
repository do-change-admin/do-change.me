import z from "zod";
import { VIN } from "@/value-objects/vin.value-object";
import { SyndicationRequestStatus } from "./sindycation-request-status.entity";

export class SyndicationRequest {
    static modelShema = z.object({
        id: z.string().nonempty(),
        userId: z.string().nonempty(),
        userMail: z.email(),
        photoLinks: z.array(z.url()),
        vin: VIN.schema,
        status: SyndicationRequestStatus.activeStatusesNameSchema,
        mileage: z.number(),
        price: z.number(),
        make: z.string().nonempty(),
        year: z.number(),
        model: z.string().nonempty(),
        marketplaceLinks: z.array(z.url())
    })

    private constructor(private readonly data: SyndicationRequestModel) {

    }

    static create = (payload: SyndicationRequestModel) => {
        return new SyndicationRequest(
            SyndicationRequest.modelShema.parse(
                payload
            )
        )
    }

    model = (): SyndicationRequestModel => {
        return this.data
    }
}

export type SyndicationRequestModel = z.infer<typeof SyndicationRequest.modelShema>
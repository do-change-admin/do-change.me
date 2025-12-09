import z from 'zod';
import { Identifier } from '@/utils/entities/identifier';
import { VIN } from '@/value-objects/vin.value-object';

export type SyndicationRequestModel = z.infer<typeof SyndicationRequest.schema>;
export type SyndicationRequestStatus = z.infer<typeof SyndicationRequest.statusSchema>;

export class SyndicationRequest {
    static statusSchema = z.enum(['pending publisher', 'active', 'pending sales', 'sold']);

    static schema = z.object({
        id: Identifier.schema,
        mainPhotoLink: z.url(),
        additionalPhotoLinks: z.array(z.url()),
        vin: VIN.schema,
        status: SyndicationRequest.statusSchema,
        mileage: z.number().nonnegative(),
        price: z.number().positive(),
        make: z.string().nonempty(),
        year: z.int().positive(),
        model: z.string().nonempty(),
        marketplaceLinks: z.array(z.url())
    });

    private constructor(private readonly data: SyndicationRequestModel) {}

    static create = (data: SyndicationRequestModel) => {
        const parsedModel = SyndicationRequest.schema.parse(data);
        return new SyndicationRequest(parsedModel);
    };

    get model(): SyndicationRequestModel {
        return this.data;
    }
}

import type z from 'zod';
import { EMailAddress } from '@/utils/entities/email-address';
import { Identifier } from '@/utils/entities/identifier';
import { SyndicationRequest } from '../syndication-request.entity';

export type UserSyndicationRequestModel = z.infer<typeof UserSyndicationRequest.schema>;

export class UserSyndicationRequest {
    static schema = SyndicationRequest.schema.extend({
        userId: Identifier.schema,
        userMail: EMailAddress.schema
    });

    private constructor(private readonly data: UserSyndicationRequestModel) {}

    static create = (data: UserSyndicationRequestModel) => {
        const parsedModel = UserSyndicationRequest.schema.parse(data);
        return new UserSyndicationRequest(parsedModel);
    };

    get model(): UserSyndicationRequestModel {
        return this.data;
    }

    get syndicationRequest(): SyndicationRequest {
        return SyndicationRequest.create({
            additionalPhotoLinks: this.model.additionalPhotoLinks,
            id: this.model.id,
            mainPhotoLink: this.model.mainPhotoLink,
            make: this.model.make,
            marketplaceLinks: this.model.marketplaceLinks,
            mileage: this.model.mileage,
            model: this.model.model,
            price: this.model.price,
            status: this.model.status,
            vin: this.model.vin,
            year: this.model.year
        });
    }
}

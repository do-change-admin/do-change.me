import type z from 'zod';
import { UserSyndicationRequest } from '../user-syndication-request.entity';

export type UserSyndicationRequestDraftModel = z.infer<typeof UserSyndicationRequestDraft.schema>;

export class UserSyndicationRequestDraft {
    static schema = UserSyndicationRequest.schema
        .omit({ status: true, marketplaceLinks: true, userMail: true })
        .partial()
        .required({
            id: true,
            userId: true
        });

    private constructor(private readonly data: UserSyndicationRequestDraftModel) {}

    static create = (data: UserSyndicationRequestDraftModel) => {
        const parsedModel = UserSyndicationRequestDraft.schema.parse(data);
        return new UserSyndicationRequestDraft(parsedModel);
    };

    get model(): UserSyndicationRequestDraftModel {
        return this.data;
    }
}

import { inject, injectable } from 'inversify';
import { DIServices } from '@/backend/di-containers/tokens.di-container';
import type { UserSyndicationRequestDraftsService } from '@/backend/services/user-syndication-request-drafts';
import { ZodController } from '@/backend/utils/zod-controller.utils';
import { userSyndicationRequestDraftsControllerMetadata } from './user-syndication-request-drafts.controller.metadata';

@injectable()
export class UserSyndicationRequestDraftsController extends ZodController(
    userSyndicationRequestDraftsControllerMetadata
) {
    public constructor(
        @inject(DIServices.userSyndicationRequestDrafts)
        private readonly userSyndicationRequestDraftsService: UserSyndicationRequestDraftsService
    ) {
        super();
    }

    GET = this.loggedEndpoint('GET', {
        handler: ({ activeUser, payload }) => {
            return this.userSyndicationRequestDraftsService.list({
                userId: activeUser.id,
                ...payload
            });
        }
    });

    Details_GET = this.loggedEndpoint('Details_GET', {
        handler: ({ payload }) => {
            return this.userSyndicationRequestDraftsService.details(payload);
        }
    });

    POST = this.loggedEndpoint('POST', {
        handler: ({ payload, activeUser }) => {
            console.log(payload, 'payload');
            return this.userSyndicationRequestDraftsService.post({
                userId: activeUser.id,
                ...(payload ?? {})
            });
        }
    });

    PATCH = this.loggedEndpoint('PATCH', {
        handler: ({ payload }) => {
            return this.userSyndicationRequestDraftsService.update(payload);
        }
    });
}

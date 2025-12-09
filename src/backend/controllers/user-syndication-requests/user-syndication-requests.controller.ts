import { inject, injectable } from 'inversify';
import { DIServices } from '@/backend/di-containers/tokens.di-container';
import type { UserSyndicationRequestsService } from '@/backend/services/user-syndication-requests';
import { ZodController } from '@/backend/utils/zod-controller.utils';
import { userSyndicationRequestsControllerMetadata } from './user-syndication-requests.controller.metadata';

@injectable()
export class UserSyndicationRequestsController extends ZodController(userSyndicationRequestsControllerMetadata) {
    public constructor(
        @inject(DIServices.userSyndicationRequests)
        private readonly userSyndicationRequestsService: UserSyndicationRequestsService
    ) {
        super();
    }

    GET = this.loggedEndpoint('GET', {
        handler: ({ activeUser, payload }) => {
            return this.userSyndicationRequestsService.list({
                userId: activeUser.id,
                ...payload
            });
        }
    });

    POST = this.loggedEndpoint('POST', {
        handler: ({ activeUser, payload }) => {
            return this.userSyndicationRequestsService.post({
                userId: activeUser.id,
                ...payload
            });
        }
    });

    Filters_GET = this.loggedEndpoint('Filters_GET', {
        handler: ({ activeUser }) => {
            return this.userSyndicationRequestsService.filters({
                userId: activeUser.id
            });
        }
    });

    FromDraft_POST = this.loggedEndpoint('FromDraft_POST', {
        handler: ({ payload }) => {
            return this.userSyndicationRequestsService.createFromDraft(payload);
        }
    });
}

import { inject, injectable } from 'inversify';
import { DIServices } from '@/backend/di-containers/tokens.di-container';
import type { UserSyndicationRequestsService } from '@/backend/services/user-syndication-requests';
import { ZodController } from '@/backend/utils/zod-controller.utils';
import { userSyndicationRequestsManagementControllerMetadata } from './user-syndication-requests-management.controller.metadata';

@injectable()
export class UserSyndicationRequestsManagementController extends ZodController(
    userSyndicationRequestsManagementControllerMetadata
) {
    public constructor(
        @inject(DIServices.userSyndicationRequests)
        private readonly userSyndicationRequestsService: UserSyndicationRequestsService
    ) {
        super();
    }

    GET = this.loggedEndpoint('GET', {
        handler: ({ payload }) => {
            return this.userSyndicationRequestsService.list(payload);
        }
    });

    PATCH = this.loggedEndpoint('PATCH', {
        handler: ({ payload }) => {
            console.log(payload, 'p');
            return this.userSyndicationRequestsService.update(payload);
        }
    });

    Filters_GET = this.loggedEndpoint('Filters_GET', {
        handler: () => {
            return this.userSyndicationRequestsService.filters({});
        }
    });

    Details_GET = this.loggedEndpoint('Details_GET', {
        handler: ({ payload }) => {
            return this.userSyndicationRequestsService.details(payload);
        }
    });
}

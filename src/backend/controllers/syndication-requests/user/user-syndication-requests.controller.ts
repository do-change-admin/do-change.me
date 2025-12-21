import { inject, injectable } from 'inversify';
import { DIServices } from '@/backend/di-containers/tokens.di-container';
import type { UserSyndicationRequestsService } from '@/backend/services/syndication-requests/user';
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

    GET = this.endpointWithAuth('GET', this.userSyndicationRequestsService.list);

    POST = this.endpointWithAuth('POST', this.userSyndicationRequestsService.post);

    Filters_GET = this.endpointWithAuth('Filters_GET', this.userSyndicationRequestsService.filters);

    FromDraft_POST = this.endpointWithAuth('FromDraft_POST', this.userSyndicationRequestsService.postFromDraft);
}

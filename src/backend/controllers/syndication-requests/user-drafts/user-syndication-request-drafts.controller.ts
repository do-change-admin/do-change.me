import { inject, injectable } from 'inversify';
import { DIServices } from '@/backend/di-containers/tokens.di-container';
import type { UserSyndicationRequestDraftsService } from '@/backend/services/syndication-requests/user-drafts';
import { ZodController } from '@/backend/utils/zod-controller.utils';
import { CommonErrorCodes } from '@/utils/error-codes';
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

    GET = this.endpointWithAuth('GET', this.userSyndicationRequestDraftsService.list);

    Filters_GET = this.endpointWithAuth('Filters_GET', this.userSyndicationRequestDraftsService.filters);

    Details_GET = this.endpointWithAuth('Details_GET', this.userSyndicationRequestDraftsService.details, {
        onError: async ({ code }) => {
            if (code === CommonErrorCodes.NO_DATA_WAS_FOUND) {
                return { message: 'No draft was found', status: 404 };
            }
        }
    });

    POST = this.endpointWithAuth('POST', this.userSyndicationRequestDraftsService.post);

    PATCH = this.endpointWithAuth('PATCH', this.userSyndicationRequestDraftsService.update);
}

import { inject, injectable } from 'inversify';
import { DIServices } from '@/backend/di-containers/tokens.di-container';
import type { SyndicationRequestsManagementService } from '@/backend/services/syndication-requests/management';
import { ZodController } from '@/backend/utils/zod-controller.utils';
import { CommonErrorCodes } from '@/utils/error-codes';
import { syndicationRequestsManagementControllerMetadata } from './user-syndication-requests-management.controller.metadata';

@injectable()
export class SyndicationRequestsManagementController extends ZodController(
    syndicationRequestsManagementControllerMetadata
) {
    public constructor(
        @inject(DIServices.userSyndicationRequestManagement)
        private readonly syndicationRequestsManagementService: SyndicationRequestsManagementService
    ) {
        super();
    }

    GET = this.endpointWithAuth('GET', this.syndicationRequestsManagementService.list);

    PATCH = this.endpointWithAuth('PATCH', this.syndicationRequestsManagementService.update);

    Filters_GET = this.endpointWithAuth('Filters_GET', this.syndicationRequestsManagementService.filters);

    Details_GET = this.endpointWithAuth('Details_GET', this.syndicationRequestsManagementService.details, {
        onError: async ({ code }) => {
            if (code === CommonErrorCodes.NO_DATA_WAS_FOUND) {
                return { message: 'No draft was found', status: 404 };
            }
        }
    });
}

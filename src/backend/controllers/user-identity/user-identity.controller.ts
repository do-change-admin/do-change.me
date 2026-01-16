import { inject, injectable } from 'inversify';
import { DIServices } from '@/backend/di-containers/tokens.di-container';
import type { UserIdentityService } from '@/backend/services/user-identity';
import { ZodController } from '@/backend/utils/zod-controller.utils';
import { userIdentityControllerMetadata } from './user-identity.controller.metadata';

@injectable()
export class UserIdentityController extends ZodController(userIdentityControllerMetadata) {
    public constructor(
        @inject(DIServices.userIdentity)
        private readonly userIdentityService: UserIdentityService
    ) {
        super();
    }

    POST = this.endpoint('POST', async (payload) => {
        await this.userIdentityService.register(payload);
    });
}

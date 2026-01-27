import { injectable } from 'inversify';
import { ZodService } from '@/backend/utils/zod-service.utils';
import { userSubscriptionServiceMetadata } from './user-subscription.service.metadata';

@injectable()
export class UserSubscriptionService extends ZodService(userSubscriptionServiceMetadata) {
    featureCounters = this.method('featureCounters', async () => {
        // TODO - implement
        return {
            boughtReports: 10,
            reportsFromSubscription: 10
        };
    });
}

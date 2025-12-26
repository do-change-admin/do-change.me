import { inject, injectable } from 'inversify';
import { DIStores } from '@/backend/di-containers/tokens.di-container';
import type { FeatureUsageStore } from '@/backend/stores/feature-usage';
import { ZodService } from '@/backend/utils/zod-service.utils';
import { userFeatureUsageMeteringServiceMetadata } from './user-feature-usage-metering.service.metadata';

@injectable()
export class UserFeatureUsageMeteringService extends ZodService(userFeatureUsageMeteringServiceMetadata) {
    constructor(@inject(DIStores.featureUsage) private readonly featureUsage: FeatureUsageStore) {
        super();
    }

    increment = this.method('increment', async ({ featureName }) => {
        const userId = await this.getUserId();
        await this.featureUsage.create({ featureName, userId });
        return {};
    });
}

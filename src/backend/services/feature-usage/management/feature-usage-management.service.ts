import { inject, injectable } from 'inversify';
import { DIStores } from '@/backend/di-containers/tokens.di-container';
import type { FeatureUsageStore } from '@/backend/stores/feature-usage';
import { ZodService } from '@/backend/utils/zod-service.utils';
import { Pagination } from '@/utils/entities/pagination';
import type { FeatureNameModel } from '@/value-objects/feature';
import { featureUsageManagementServiceMetadata } from './feature-usage-management.service.metadata';

@injectable()
export class FeatureUsageManagementService extends ZodService(featureUsageManagementServiceMetadata) {
    constructor(@inject(DIStores.featureUsage) private readonly featureUsage: FeatureUsageStore) {
        super();
    }

    getForUser = this.method('getForUser', async ({ userId }) => {
        const data = await this.featureUsage.list({ userId }, Pagination.onePageRequest);
        const groupedData = Object.groupBy(data, (x) => x.featureName);
        const entriesWithCount = Object.entries(groupedData).map(([key, values]) => [key, values.length] as const);

        return Object.fromEntries(entriesWithCount) as Record<FeatureNameModel, number>;
    });
}

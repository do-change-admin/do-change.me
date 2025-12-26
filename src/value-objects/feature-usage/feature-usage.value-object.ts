import z from 'zod';
import { Identifier } from '@/utils/entities/identifier';
import { Feature } from '../feature/feature.value-object';

export type FeatureUsageModel = z.infer<typeof FeatureUsage.schema>;

export class FeatureUsage {
    static schema = z.object({
        userId: Identifier.schema,
        featureName: Feature.nameSchema,
        registeredAt: z.date()
    });

    private constructor(private readonly data: FeatureUsageModel) {}

    static create = (data: FeatureUsageModel) => {
        const parsedModel = FeatureUsage.schema.parse(data);
        return new FeatureUsage(parsedModel);
    };

    get model(): FeatureUsageModel {
        return this.data;
    }
}

import z from 'zod';

export type FeatureModel = z.infer<typeof Feature.schema>;

export type FeatureNameModel = z.infer<typeof Feature.nameSchema>;

export class Feature {
    static nameSchema = z.enum(['base info']);

    static schema = z.object({
        name: Feature.nameSchema
    });

    private constructor(private readonly data: FeatureModel) {}

    static create = (data: FeatureModel) => {
        const parsedModel = Feature.schema.parse(data);
        return new Feature(parsedModel);
    };

    get model(): FeatureModel {
        return this.data;
    }

    get name(): FeatureNameModel {
        return this.data.name;
    }
}

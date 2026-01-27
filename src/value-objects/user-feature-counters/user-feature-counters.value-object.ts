import z from 'zod';

export type UserFeatureCountersModel = z.infer<typeof UserFeatureCounters.schema>;

export class UserFeatureCounters {
    static schema = z.object({
        reportsFromSubscription: z.int().nonnegative(),
        boughtReports: z.int().nonnegative()
    });

    private constructor(private readonly data: UserFeatureCountersModel) {}

    static create = (data: UserFeatureCountersModel) => {
        const parsedModel = UserFeatureCounters.schema.parse(data);
        return new UserFeatureCounters(parsedModel);
    };

    get model(): UserFeatureCountersModel {
        return this.data;
    }

    get hasReportsLeft(): boolean {
        return !!this.data.boughtReports || !!this.data.reportsFromSubscription;
    }
}

import z from 'zod';
import { EMailAddress } from '@/utils/entities/email-address';
import { Identifier } from '@/utils/entities/identifier';

export type UserModel = z.infer<typeof User.schema>;

export class User {
    static schema = z.object({
        id: Identifier.schema,
        email: EMailAddress.schema,
        firstName: z.string().nonempty(),
        lastName: z.string().nonempty(),
        password: z.string().min(8).optional(),
        image: z.string().nonempty().optional(),
        emailVerifiedAt: z.date().optional(),
        phone: z.string().nonempty().optional(),
        bio: z.string().nonempty().optional(),
        address: z.string().nonempty().optional(),
        state: z.string().nonempty().optional(),
        zipCode: z.string().nonempty().optional(),
        auctionAccessNumber: z.string().nonempty().optional(),
        auctionAccessQRFileId: z.string().nonempty().optional(),
        photoFileId: z.string().nonempty().optional(),
        birthDate: z.date().optional(),
        userPlan: z.array(
            z.object({
                id: z.number(),
                status: z.string().nonempty(),
                canceledAt: z.date().optional(),
                cancelAtPeriodEnd: z.boolean(),
                currentPeriodStart: z.date(),
                currentPeriodEnd: z.date(),
                stripeSubscriptionId: Identifier.schema,
                plan: z.object({
                    id: z.number(),
                    slug: z.string().nonempty(),
                    name: z.string().nonempty(),
                    stripeProductId: Identifier.schema,
                    description: z.string().nonempty().optional(),
                    active: z.boolean(),
                    reportsCount: z.number()
                }),
                planPrice: z.object({
                    id: z.number(),
                    planId: z.number(),
                    stripePriceId: Identifier.schema,
                    slug: z.string().nonempty(),
                    interval: z.string().nonempty(),
                    amount: z.number(),
                    currency: z.string().nonempty()
                })
            })
        )
    });

    private constructor(private readonly data: UserModel) {}

    static create = (data: UserModel) => {
        const parsedModel = User.schema.parse(data);
        return new User(parsedModel);
    };

    get model(): UserModel {
        return this.data;
    }
}

import z from "zod";
import { ZodAPIController, zodApiMethod, ZodAPISchemas, ZodControllerSchemas } from "../utils/zod-api-controller____DEPRECATED.utils";
import { injectable } from "inversify";
import { prismaClient } from "../infrastructure";

const schemas = {
    CurrentInfo_GET: {
        body: undefined,
        query: undefined,
        response: z.object({
            level: z.enum([
                'no subscription',
                'basic plan',
                'premium plan'
            ])
        })

    }
} satisfies ZodControllerSchemas

@injectable()
export class SubscriptionsController {
    public constructor() { }

    CurrentInfo_GET = zodApiMethod(schemas.CurrentInfo_GET, {
        handler: async ({ activeUser: { id } }) => {
            // TODO - encapsulate prisma in user store
            const user = await prismaClient.user.findUnique({
                where: { id },
                include: { userPlan: { include: { plan: true } } }
            })

            if (!user?.userPlan || !user?.userPlan?.length) {
                return { level: 'no subscription' } as const
            }

            const alwaysPremiumOnAnySubscription = process.env.PREMIUM_ON_ANY_SUBSCRIPTION_USERS_IDS?.split(',') ?? []

            if (alwaysPremiumOnAnySubscription.includes(id)) {
                return { level: 'premium plan' } as const
            }

            const [currentPlan] = user.userPlan;

            if (currentPlan.plan.slug === 'auction access') {
                return { level: 'premium plan' } as const
            }

            return { level: 'basic plan' } as const
        }
    })
}

export type SubscriptionsAPI = ZodAPIController<typeof schemas>
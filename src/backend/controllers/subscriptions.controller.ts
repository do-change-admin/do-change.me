import z from "zod";
import { ZodController, zodApiMethod, ZodAPISchemas, ZodControllerSchemas } from "../utils/zod-api-controller.utils";
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
            ]),
            isAdmin: z.boolean()
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

            const isAdmin = (process.env.ADMIN_EMAILS?.split(",") ?? []).includes(user?.email ?? '')

            if (!user?.userPlan || !user?.userPlan?.length) {
                return { level: 'no subscription', isAdmin } as const
            }

            const alwaysPremiumOnAnySubscription = process.env.PREMIUM_ON_ANY_SUBSCRIPTION_USERS_IDS?.split(',') ?? []

            if (alwaysPremiumOnAnySubscription.includes(id)) {
                return { level: 'premium plan', isAdmin } as const
            }

            const [currentPlan] = user.userPlan;

            if (currentPlan.plan.slug === 'auction access') {
                return { level: 'premium plan', isAdmin } as const
            }

            return { level: 'basic plan', isAdmin } as const
        }
    })
}

export type SubscriptionsAPI = ZodController<typeof schemas>
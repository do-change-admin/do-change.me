import z from "zod";
import { ZodAPIMethod, zodApiMethod } from "../zod-api-methods";
import { prismaClient } from "@/infrastructure/prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});

const querySchema = z.object({
    subscriptionId: z.string().nonempty(),
});

export type Method = ZodAPIMethod<typeof querySchema, undefined, undefined>;

export const handler = zodApiMethod(
    querySchema,
    undefined,
    undefined,
    async (payload) => {
        const { activeUser, subscriptionId } = payload;

        const stripeCustomer = await prismaClient.stripeCustomer.findUnique({
            where: { userId: activeUser.id },
        });

        if (!stripeCustomer) {
            throw new Error("Stripe customer not found");
        }

        const subscription = await prismaClient.stripeSubscription.findFirst({
            where: {
                stripeSubscriptionId: subscriptionId,
                customerId: stripeCustomer.id,
            },
        });

        if (!subscription) {
            throw new Error("Subscription not found");
        }

        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });
    }
);

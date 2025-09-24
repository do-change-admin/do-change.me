import z from "zod";
import { ZodAPIMethod, zodApiMethod } from "../zod-api-methods";
import { prismaClient } from "@/infrastructure";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});

const bodySchema = z.object({
    priceId: z.string().nonempty(),
});

export type Method = ZodAPIMethod<undefined, typeof bodySchema, undefined>;

export const handler = zodApiMethod(
    undefined,
    bodySchema,
    undefined,
    async (payload) => {
        const { activeUser, priceId } = payload;

        const userPlan = await prismaClient.userPlan.findFirst({
            where: { userId: activeUser.id },
        });

        if (!userPlan) {
            throw new Error("Active subscription not found");
        }

        const subscriptionItems =
            await prismaClient.stripeSubscriptionItem.findMany({
                where: {
                    subscription: {
                        stripeSubscriptionId: userPlan.stripeSubscriptionId,
                    },
                },
            });

        if (subscriptionItems.length === 0) {
            throw new Error(
                "Subscription item not found (no items for that subscription)"
            );
        }

        if (subscriptionItems.length > 1) {
            throw new Error(
                "Invariant violated: multiple subscription items found — aborting to preserve one-item rule"
            );
        }

        const subscriptionItem = subscriptionItems[0];

        await stripe.subscriptions.update(userPlan.stripeSubscriptionId, {
            items: [
                { id: subscriptionItem.stripeItemId, deleted: true },
                { price: priceId, quantity: 1 },
            ],
            proration_behavior: "none",
            billing_cycle_anchor: "now",
        });
    }
);

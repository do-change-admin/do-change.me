import z from "zod";
import { ZodAPIMethod, zodApiMethod } from "../../zod-api-methods";
import { prismaClient } from "@/infrastructure/prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});

const bodySchema = z.object({
    subscriptionId: z.string().nonempty(),
});

export type Method = ZodAPIMethod<undefined, undefined, typeof bodySchema>;

export const handler = zodApiMethod(
    undefined,
    bodySchema,
    undefined,
    async (payload) => {
        const stripeCustomer = await prismaClient.stripeCustomer.findUnique({
            where: { userId: payload.activeUser.id },
        });

        if (!stripeCustomer) {
            throw new Error("Stripe customer not found");
        }

        const subscription = await prismaClient.stripeSubscription.findFirst({
            where: {
                stripeSubscriptionId: payload.subscriptionId,
                customerId: stripeCustomer.id,
            },
        });

        if (!subscription) {
            throw new Error("Subscription not found");
        }

        await stripe.subscriptions.update(payload.subscriptionId, {
            cancel_at_period_end: true,
        });

        return { success: true };
    }
);

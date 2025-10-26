import z from "zod";
import {
    ZodAPIMethod_DEPRECATED,
    zodApiMethod_DEPRECATED,
} from "../zod-api-methods";
import { prismaClient } from "@/backend/infrastructure/prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});

const querySchema = z.object({
    subscriptionId: z.coerce.number(),
});

export type Method = ZodAPIMethod_DEPRECATED<
    typeof querySchema,
    undefined,
    undefined
>;

export const handler = zodApiMethod_DEPRECATED(
    querySchema,
    undefined,
    undefined,
    async (payload) => {
        const { activeUser, subscriptionId } = payload;

        const userPlan = await prismaClient.userPlan.findUnique({
            where: {
                id: subscriptionId,
            },
        });

        if (!userPlan || userPlan.userId !== activeUser.id) {
            throw new Error("User plan not found");
        }

        await stripe.subscriptions.update(userPlan.stripeSubscriptionId, {
            cancel_at_period_end: true,
        });
    }
);

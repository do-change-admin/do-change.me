import z from "zod";
import { prismaClient } from "@/infrastructure";
import Stripe from "stripe";
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../zod-api-methods";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});

const bodySchema = z.object({
    planId: z.string().nonempty(),
    priceId: z.string().nonempty(),
});

const responseSchema = z.object({
    url: z.string().nullable(),
});

export type Method = ZodAPIMethod_DEPRECATED<
    undefined,
    typeof bodySchema,
    typeof responseSchema
>;

export const handler = zodApiMethod_DEPRECATED(
    undefined,
    bodySchema,
    responseSchema,
    async (payload) => {
        const { activeUser, planId, priceId } = payload;

        let stripeCustomer = await prismaClient.stripeCustomer.findUnique({
            where: { userId: activeUser.id },
        });

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: activeUser.email,
                metadata: { userId: activeUser.id },
            });

            stripeCustomer = await prismaClient.stripeCustomer.create({
                data: {
                    userId: activeUser.id,
                    stripeCustomerId: customer.id,
                },
            });
        }

        const planPrice = await prismaClient.planPrice.findUnique({
            where: { stripePriceId: priceId },
            include: { plan: true },
        });

        if (!planPrice) {
            throw new Error("Price not found");
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: stripeCustomer.stripeCustomerId,
            line_items: [{ price: planPrice.stripePriceId, quantity: 1 }],
            client_reference_id: activeUser.id,
            subscription_data: {
                metadata: {
                    userId: activeUser.id,
                    planId: planId,
                    priceId: planPrice.id,
                },
            },
            success_url: `${process.env.NEXTAUTH_URL}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
        });

        return { url: session.url };
    }
);

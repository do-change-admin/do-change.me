import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prismaClient } from "@/infrastructure/prisma/client";
import { businessError, serverError } from "@/lib/errors";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const payload = await req.text();
    const sig = req.headers.get("stripe-signature") || "";

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (err) {
        return NextResponse.json(
            businessError(
                "Webhook signature verification failed",
                "STRIPE_ERROR"
            ),
            {
                status: 400,
            }
        );
    }

    try {
        switch (event.type) {
            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const subscription = event.data.object;

                const sub = await prismaClient.stripeSubscription.upsert({
                    where: { stripeSubscriptionId: subscription.id },
                    update: {
                        status: subscription.status,
                        cancelAtPeriodEnd: subscription.cancel_at_period_end,
                        canceledAt: subscription.cancel_at
                            ? new Date(subscription.cancel_at * 1000)
                            : null,
                        trialEnd: subscription.trial_end
                            ? new Date(subscription.trial_end * 1000)
                            : null,
                        metadata: subscription.metadata,
                    },
                    create: {
                        stripeSubscriptionId: subscription.id,
                        customer: {
                            connect: {
                                stripeCustomerId:
                                    subscription.customer as string,
                            },
                        },
                        status: subscription.status,
                        cancelAtPeriodEnd: subscription.cancel_at_period_end,
                        canceledAt: subscription.cancel_at
                            ? new Date(subscription.cancel_at * 1000)
                            : null,
                        trialEnd: subscription.trial_end
                            ? new Date(subscription.trial_end * 1000)
                            : null,
                        metadata: subscription.metadata,
                    },
                });

                for (const item of subscription.items.data) {
                    await prismaClient.stripeSubscriptionItem.upsert({
                        where: { stripeItemId: item.id },
                        update: {
                            priceId: item.price.id,
                            productId: item.price.product as string,
                            quantity: item.quantity ?? 1,
                            currentPeriodStart: new Date(
                                item.current_period_start * 1000
                            ),
                            currentPeriodEnd: new Date(
                                item.current_period_end * 1000
                            ),
                        },
                        create: {
                            stripeItemId: item.id,
                            subscriptionId: sub.id,
                            priceId: item.price.id,
                            productId: item.price.product as string,
                            quantity: item.quantity ?? 1,
                            currentPeriodStart: new Date(
                                item.current_period_start * 1000
                            ),
                            currentPeriodEnd: new Date(
                                item.current_period_end * 1000
                            ),
                        },
                    });
                }

                const currentItemIds = subscription.items.data.map(
                    (item) => item.id
                );

                await prismaClient.stripeSubscriptionItem.deleteMany({
                    where: {
                        subscriptionId: sub.id,
                        stripeItemId: { notIn: currentItemIds },
                    },
                });

                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object;

                const subRecord = await prismaClient.stripeSubscription.update({
                    where: { stripeSubscriptionId: subscription.id },
                    data: { status: subscription.status },
                });

                await prismaClient.stripeSubscriptionItem.deleteMany({
                    where: { subscriptionId: subRecord.id },
                });

                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        NextResponse.json(serverError(), { status: 500 });
    }
}

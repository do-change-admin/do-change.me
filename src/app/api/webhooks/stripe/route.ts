import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prismaClient } from "@/backend/infrastructure/prisma/client";
import { businessError, serverError } from "@/lib-deprecated/errors";

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
        const existing = await prismaClient.stripeEvent.findUnique({
            where: { eventId: event.id },
        });

        if (existing) {
            return NextResponse.json({ received: true, duplicate: true });
        }

        await prismaClient.stripeEvent.create({
            data: {
                eventId: event.id,
                type: event.type,
                rawPayload: JSON.parse(payload),
            },
        });
    } catch (err) {
        return NextResponse.json(serverError(), { status: 500 });
    }

    try {
        switch (event.type) {
            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const subscription = event.data.object;
                await prismaClient.$transaction(async (tx) => {
                    const sub = await tx.stripeSubscription.upsert({
                        where: { stripeSubscriptionId: subscription.id },
                        update: {
                            status: subscription.status,
                            cancelAtPeriodEnd:
                                subscription.cancel_at_period_end,
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
                            cancelAtPeriodEnd:
                                subscription.cancel_at_period_end,
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
                        await tx.stripeSubscriptionItem.upsert({
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

                    await tx.stripeSubscriptionItem.deleteMany({
                        where: {
                            subscriptionId: sub.id,
                            stripeItemId: { notIn: currentItemIds },
                        },
                    });

                    const stripeCustomer = await tx.stripeCustomer.findUnique({
                        where: {
                            stripeCustomerId: subscription.customer as string,
                        },
                    });

                    if (!stripeCustomer) {
                        return NextResponse.json(
                            businessError(
                                "Customer not found for UserPlan",
                                "CUSTOMER_NOT_FOUND"
                            ),
                            { status: 400 }
                        );
                    }

                    const item = subscription.items.data[0];

                    if (!item) {
                        return NextResponse.json(
                            businessError(
                                "Subscription has no items",
                                "INVALID_SUBSCRIPTION"
                            ),
                            { status: 400 }
                        );
                    }

                    const planPrice = await tx.planPrice.findUnique({
                        where: { stripePriceId: item.price.id },
                    });

                    if (!planPrice) {
                        return NextResponse.json(
                            businessError(
                                `Price not found for ${item.price.id}`,
                                "INVALID_SUBSCRIPTION"
                            ),
                            { status: 400 }
                        );
                    }

                    await tx.userPlan.upsert({
                        where: {
                            userId_stripeSubscriptionId: {
                                userId: stripeCustomer.userId,
                                stripeSubscriptionId: subscription.id,
                            },
                        },
                        update: {
                            status: subscription.status,
                            cancelAtPeriodEnd:
                                subscription.cancel_at_period_end,
                            canceledAt: subscription.cancel_at
                                ? new Date(subscription.cancel_at * 1000)
                                : null,
                            currentPeriodStart: new Date(
                                item.current_period_start * 1000
                            ),
                            currentPeriodEnd: new Date(
                                item.current_period_end * 1000
                            ),
                            planId: planPrice.planId,
                            planPriceId: planPrice.id,
                        },
                        create: {
                            userId: stripeCustomer.userId,
                            planId: planPrice.planId,
                            planPriceId: planPrice.id,
                            stripeSubscriptionId: subscription.id,
                            status: subscription.status,
                            cancelAtPeriodEnd:
                                subscription.cancel_at_period_end,
                            canceledAt: subscription.cancel_at
                                ? new Date(subscription.cancel_at * 1000)
                                : null,
                            currentPeriodStart: new Date(
                                item.current_period_start * 1000
                            ),
                            currentPeriodEnd: new Date(
                                item.current_period_end * 1000
                            ),
                        },
                    });
                });

                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object;

                await prismaClient.$transaction(async (tx) => {
                    const subRecord = await tx.stripeSubscription.update({
                        where: { stripeSubscriptionId: subscription.id },
                        data: { status: subscription.status },
                    });

                    await tx.stripeSubscriptionItem.deleteMany({
                        where: { subscriptionId: subRecord.id },
                    });

                    await tx.userPlan.update({
                        where: { stripeSubscriptionId: subscription.id },
                        data: {
                            status: subscription.status,
                            cancelAtPeriodEnd:
                                subscription.cancel_at_period_end,
                            canceledAt: subscription.cancel_at
                                ? new Date(subscription.cancel_at * 1000)
                                : null,
                        },
                    });
                });

                break;
            }
        }

        await prismaClient.stripeEvent.update({
            where: { eventId: event.id },
            data: { processed: true },
        });

        return NextResponse.json({ received: true });
    } catch (err) {
        await prismaClient.stripeEvent.update({
            where: { eventId: event.id },
            data: { attempts: { increment: 1 } },
        });
        return NextResponse.json(serverError(), { status: 500 });
    }
}

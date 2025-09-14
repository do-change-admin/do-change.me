import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prismaClient } from "@/infrastructure/prisma/client";
import { CreateCheckoutRequest } from "./models";
import { businessError, serverError, validationError } from "@/lib/errors";
import z from "zod";
import { getCurrentUser } from "@/lib/getCyrrentUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { success, data, error } = CreateCheckoutRequest.safeParse(body);

    if (!success) {
        return NextResponse.json(validationError(z.treeifyError(error)), {
            status: 400,
        });
    }

    const { priceId } = data;

    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                businessError("User not found", "USER_NOT_FOUND"),
                { status: 400 }
            );
        }

        let stripeCustomer = await prismaClient.stripeCustomer.findUnique({
            where: { userId: user.id },
        });

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { userId: user.id },
            });

            stripeCustomer = await prismaClient.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                },
            });
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: stripeCustomer.stripeCustomerId,
            line_items: [{ price: priceId, quantity: 1 }],
            client_reference_id: user.id,
            subscription_data: {
                metadata: { userId: user.id },
            },
            // TODO: узнать адреса у фронта
            success_url: `${process.env.NEXTAUTH_URL}/account/billing?success=1`,
            cancel_url: `${process.env.NEXTAUTH_URL}/account/billing?canceled=1`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        return NextResponse.json(serverError(), { status: 500 });
    }
}

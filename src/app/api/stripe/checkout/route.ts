import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { priceId } = await req.json();

        if (!priceId) {
            return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `/success`,
            cancel_url: `/cancel`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: unknown) {
        console.error("Checkout error:", error);

        const message =
            error instanceof Error
                ? error.message
                : typeof error === "string"
                    ? error
                    : "Unknown error";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}

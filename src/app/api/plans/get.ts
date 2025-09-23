import z from "zod";
import { zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED } from "../zod-api-methods";
import { prismaClient } from "@/infrastructure";

const planPriceSchema = z.object({
    id: z.number(),
    planId: z.number(),
    slug: z.string(),
    interval: z.string(),
    amount: z.number(),
    currency: z.string(),
    stripePriceId: z.string(),
});

const planSchema = z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    active: z.boolean(),
    stripeProductId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    prices: z.array(planPriceSchema),
});

const responseSchema = z.object({
    plans: z.array(planSchema),
});

export type Method = ZodAPIMethod_DEPRECATED<undefined, undefined, typeof responseSchema>;

export const handler = zodApiMethod_DEPRECATED(
    undefined,
    undefined,
    responseSchema,
    async () => {
        const plans = await prismaClient.plan.findMany({
            include: { prices: { orderBy: { id: "asc" } } },
            orderBy: { id: "asc" },
        });

        return { plans };
    }
);

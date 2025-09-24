import z from "zod";
import { zodApiMethod, ZodAPIMethod } from "../zod-api-methods";
import { prismaClient } from "@/infrastructure";

const querySchema = z.object({
    available: z
        .string()
        .transform((v) => v === "true")
        .optional(),
});

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

export type Method = ZodAPIMethod<
    typeof querySchema,
    undefined,
    typeof responseSchema
>;

export const handler = zodApiMethod(
    querySchema,
    undefined,
    responseSchema,
    async (payload) => {
        const { activeUser, available } = payload;

        let excludePlanId: number | undefined = undefined;

        if (available) {
            const userPlan = await prismaClient.userPlan.findFirst({
                where: { userId: activeUser.id },
            });
            excludePlanId = userPlan?.planId;
        }

        const plans = await prismaClient.plan.findMany({
            where: {
                active: true,
                ...(excludePlanId ? { id: { not: excludePlanId } } : {}),
            },
            include: { prices: { orderBy: { id: "asc" } } },
            orderBy: { id: "asc" },
        });

        return { plans };
    }
);

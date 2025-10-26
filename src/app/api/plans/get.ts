import z from "zod";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../zod-api-methods";
import { prismaClient } from "@/backend/infrastructure";

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

const schemas = {
    body: undefined,
    query: querySchema,
    response: z.object({
        basic: planSchema.nullable(),
        auctionAccess: planSchema.nullable(),
    }),
} satisfies ZodAPISchemas;

export type Method = ZodAPIMethod<typeof schemas>;

export const method = zodApiMethod(schemas, {
    handler: async (res) => {
        const { payload, activeUser } = res;

        let excludePlanId: number | undefined = undefined;

        if (payload.available) {
            const userPlan = await prismaClient.userPlan.findFirst({
                where: { userId: activeUser.id },
            });
            excludePlanId = userPlan?.planId;
        }

        const [basic, auctionAccess] = await Promise.all([
            prismaClient.plan.findFirst({
                where: { slug: "basic" },
                include: { prices: true },
            }),
            prismaClient.plan.findFirst({
                where: { slug: "auction access" },
                include: { prices: true },
            }),
        ]);

        return {
            basic: basic && basic.id !== excludePlanId ? basic : null,
            auctionAccess:
                auctionAccess && auctionAccess.id !== excludePlanId
                    ? auctionAccess
                    : null,
        };
    },
});

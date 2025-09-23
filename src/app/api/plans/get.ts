import z from "zod";
import { zodApiMethod, ZodAPIMethod, zodApiMethod_DEPRECATED, ZodAPIMethod_DEPRECATED, ZodAPISchemas } from "../zod-api-methods";
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

const schemas = {
    body: undefined,
    query: undefined,
    response: z.object({
        basic: planSchema,
        auctionAccess: planSchema
    })
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async () => {
        const basic = await prismaClient.plan.findFirst({
            where: { slug: "basic" },
            include: { prices: true }
        })
        const auctionAccess = await prismaClient.plan.findFirst({
            where: { slug: "auction access" },
            include: { prices: true }
        })

        return {
            auctionAccess: auctionAccess!,
            basic: basic!
        };

    }
})

import z from "zod";
import { zodApiMethod, ZodAPIMethod } from "../zod-api-methods";
import { prismaClient } from "@/infrastructure";

const subscriptionSchema = z.object({
    planName: z.string(),
    planSlug: z.string(),
    priceSlug: z.string(),
    status: z.string(),
    cancelAtPeriodEnd: z.boolean(),
    currentPeriodEnd: z.date(),
    amount: z.number(),
    currency: z.string(),
});

const responseSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    email: z.string(),
    bio: z.string(),
    subscription: subscriptionSchema.nullable(),
});

export type Method = ZodAPIMethod<undefined, undefined, typeof responseSchema>;

export const handler = zodApiMethod(
    undefined,
    undefined,
    responseSchema,
    async (payload) => {
        const { id } = payload.activeUser;

        let profile = await prismaClient.user.findUnique({
            where: { id },
            include: {
                userPlan: {
                    where: { status: "active" },
                    include: { plan: true, price: true },
                },
            },
        });

        if (!profile) {
            throw new Error("User not found");
        }

        const activePlan = profile.userPlan.at(0);

        return {
            bio: profile.bio ?? "",
            email: profile.email,
            firstName: profile.firstName ?? "",
            lastName: profile.lastName ?? "",
            phone: profile.phone ?? "",
            subscription: activePlan
                ? {
                      planName: activePlan.plan.name,
                      planSlug: activePlan.plan.slug,
                      priceSlug: activePlan.price.slug,
                      status: activePlan.status,
                      cancelAtPeriodEnd: activePlan.cancelAtPeriodEnd,
                      currentPeriodEnd: activePlan.currentPeriodEnd,
                      amount: activePlan.price.amount,
                      currency: activePlan.price.currency,
                  }
                : null,
        };
    }
);

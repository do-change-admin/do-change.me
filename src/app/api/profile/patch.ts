import z from "zod";
import { zodApiMethod, ZodAPIMethod } from "../zod-api-methods";
import { prismaClient } from "@/infrastructure";

const bodySchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    bio: z.string().optional(),
})

export type Method = ZodAPIMethod<undefined, typeof bodySchema, undefined>

export const handler = zodApiMethod(undefined, bodySchema, undefined, async (payload) => {
    const { bio, firstName, lastName, phone } = payload
    await prismaClient.user.update({
        where: { email: payload.activeUser.email },
        data: { bio, firstName, lastName, phone },
    })
})
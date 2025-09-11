import z from "zod";
import { zodApiMethod, ZodAPIMethod } from "../zod-api-methods";
import { prismaClient } from "@/infrastructure";

const responseSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    email: z.string(),
    bio: z.string(),
})

export type Method = ZodAPIMethod<undefined, undefined, typeof responseSchema>

export const handler = zodApiMethod(undefined, undefined, responseSchema, async (payload) => {
    const { email } = payload.activeUser
    let profile = await prismaClient?.user.findUnique({ where: { email } })
    if (!profile) {
        // TODO - насколько вообще норм, что его тут может не быть? обсудить с Максом
        profile = await prismaClient?.user.create({ data: { email } })
    }
    return {
        bio: profile.bio ?? "",
        email: profile.email,
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phone: profile.phone ?? ""
    }
})
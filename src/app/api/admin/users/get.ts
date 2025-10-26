import z from "zod";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../../../backend/utils/zod-api-controller.utils";
import { prismaClient } from "@/backend/infrastructure";
import { FeatureKey } from "@/value-objects/feature-key.vo";

const schemas = {
    query: undefined,
    body: undefined,
    response: z.object({
        users: z.array(
            z.object({
                id: z.string(),
                email: z.email(),
                downloadedReports: z.number(),
                subscription: z.object({
                    type: z.enum(['auction access', 'basic']),
                    isActive: z.boolean()
                }).nullable()
            })
        )
    })
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async () => {
        const allUsers = await prismaClient.user.findMany({ include: { userPlan: { include: { plan: true } } } })
        const data = await prismaClient.usageAggregate.findMany({
            where: { featureKey: FeatureKey.Report },
            include: { user: true }
        })

        const usageData = data.reduce((acc, current) => {
            if (!acc[current.userId]) {
                acc[current.userId] = { email: current.user.email, usage: 0 }
            }

            acc[current.userId].usage += current.usageCount

            return acc
        }, {} as Record<string, { email: string, usage: number }>)

        return {
            users: allUsers.map((x) => {
                return {
                    id: x.id,
                    email: x.email,
                    downloadedReports: usageData[x.id]?.usage ?? 0,
                    subscription: x.userPlan?.[0] ? {
                        isActive: x.userPlan?.[0].status === 'active',
                        type: x.userPlan?.[0].plan.slug as any
                    } : null
                }
            })
        }
    }
})
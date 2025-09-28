import z from "zod";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { prismaClient } from "@/infrastructure";
import { FeatureKey } from "@/value-objects/feature-key.vo";

const schemas = {
    query: undefined,
    body: undefined,
    response: z.object({
        users: z.array(
            z.object({
                id: z.string(),
                email: z.email(),
                downloadedReports: z.number()
            })
        )
    })
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async () => {
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
            users: Object.entries(usageData).map(([id, data]) => {
                return {
                    id,
                    email: data.email,
                    downloadedReports: data.usage
                }
            })
        }
    }
})
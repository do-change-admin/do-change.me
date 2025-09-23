import z from "zod";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { VinSchema } from "@/schemas";
import { RequestsMeteringService } from "@/services/requests-metering/requests-metering.service";
import { FeatureKey } from "@/value-objects/feature-key.vo";
import { businessError } from "@/lib/errors";
import { noSubscriptionsGuard } from "@/api-guards";

const schemas = {
    body: undefined,
    query: z.object({
        vin: VinSchema,
        provider: z.enum(['carfax', 'autocheck'])
    }),
    response: z.object({
        type: z.enum(["html"]),
        markup: z.string(),
    })
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload: { provider, vin } }) => {
        const url = `${process.env.REPORT_ENDPOINT}/${provider}/${vin}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "API-KEY": process.env.REPORT_KEY!,
                "API-SECRET": process.env.REPORT_SECRET!,
            },
        });

        if (!response.ok) {
            throw businessError('Error on report obtaining')
        }

        const text = await response.text();

        if (text.includes(`"title":"Error"`)) {
            throw businessError('Error on report obtaining')
        }

        const markup = Buffer.from(text, "base64").toString("utf-8");

        return {
            markup,
            type: 'html' as const
        }
    },
    onSuccess: async ({ activeUser }) => {
        const service = new RequestsMeteringService(activeUser.id)
        await service.incrementUsage(FeatureKey.Report)
    },
    beforehandler: noSubscriptionsGuard
})
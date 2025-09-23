import z from "zod";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { VinSchema } from "@/schemas";
import { baseVehicleInfoSchema } from "./schemas";
import presetData from "./presetData";
import { prismaClient } from "@/infrastructure";
import { businessError } from "@/lib/errors";
import { noSubscriptionsGuard } from "@/api-guards";
import { ActionsHistoryService } from "@/services";

const schemas = {
    body: undefined,
    query: z.object({
        vin: VinSchema
    }),
    response: baseVehicleInfoSchema,
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const baseInfoURL =
            process.env.BASE_INFO_API_URL
        if (!baseInfoURL) {
            return presetData;
        }

        const apiAnswer = await fetch(`${baseInfoURL}/${payload.vin}?format=json`);
        const json = await apiAnswer.json();

        if (!json?.Results?.[0]) {
            throw businessError('No base data was found for this vehicle', undefined, 404)
        }

        return json?.Results?.[0];
    },
    onSuccess: async ({ result, requestPayload }) => {
        if (!process.env.BASE_INFO_API_URL) {
            return;
        }

        await prismaClient.vinCheckResult.deleteMany({
            where: { VIN: requestPayload.vin }
        })
        await prismaClient.vinCheckResult.create({ data: result }) ?? [];
        ActionsHistoryService.Register({ target: "base info", payload: { vin: requestPayload.vin, result } })
    },
    beforehandler: noSubscriptionsGuard
})
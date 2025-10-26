import z from "zod";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../../../backend/utils/zod-api-controller.utils";
import { baseVehicleInfoSchema } from "./schemas";
import { prismaClient } from "@/backend/infrastructure";
import { businessError } from "@/lib-deprecated/errors";
import { noSubscriptionGuard } from "@/backend/api-guards/no-subscription.api-guard";
import { ActionsHistoryService } from "@/backend/services";
import { isDemoVin, VinAPIFlags } from "../vin-api.helpers";
import { VIN } from "@/value-objects/vin.value-object";

const schemas = {
    body: undefined,
    query: z.object({
        vin: VIN.schema
    }),
    response: baseVehicleInfoSchema,
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>


export const method = zodApiMethod(schemas, {
    handler: async ({ payload, flags }) => {
        const cachedBaseInfoData = await prismaClient.vinCheckResult.findFirst({
            where: { VIN: payload.vin }
        });

        if (cachedBaseInfoData) {
            flags[VinAPIFlags.DATA_WAS_TAKEN_FROM_CACHE] = true
            return cachedBaseInfoData
        }

        const apiAnswer = await fetch(`${process.env.BASE_INFO_API_URL}/${payload.vin}?format=json`);
        const json = await apiAnswer.json();

        if (!json?.Results?.[0]) {
            throw businessError('No base data was found for this vehicle', undefined, 404)
        }

        return json?.Results?.[0];
    },
    onSuccess: async ({ result, requestPayload, flags }) => {
        if (!flags[VinAPIFlags.DATA_WAS_TAKEN_FROM_CACHE]) {
            await prismaClient.vinCheckResult.create({ data: result }) ?? [];
        }
        const isDemo = await isDemoVin({ payload: { vin: requestPayload.vin } })
        if (!isDemo) {
            await ActionsHistoryService.Register({
                target: "base info",
                payload: { vin: requestPayload.vin, result }
            })
        }
    },

    beforehandler: noSubscriptionGuard,
    ignoreBeforeHandler: isDemoVin
})
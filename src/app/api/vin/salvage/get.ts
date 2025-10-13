import { VinSchema } from "@/schemas"
import z from "zod"
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods"
import { prismaClient } from "@/infrastructure"
import { ActionsHistoryService } from "@/services"
import { noSubscriptionsGuard } from "@/api-guards"
import { isDemoVin, VinAPIFlags } from "../vin-api.helpers"
import { businessError } from "@/lib/errors"

const schemas = {
    body: undefined,
    query: z.object({
        vin: VinSchema
    }),
    response: z.object({
        salvageWasFound: z.boolean()
    })
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload, flags }) => {
        const cachedData = await prismaClient.salvageInfo.findFirst({
            where: {
                vin: payload.vin
            }
        })

        if (cachedData) {
            flags[VinAPIFlags.DATA_WAS_TAKEN_FROM_CACHE] = true
            return { salvageWasFound: cachedData.salvageWasFound }
        }

        const response = await fetch(`${process.env.SALVAGE_ENDPOINT!}?vin=${payload.vin}`, {
            method: "GET",
            headers: {
                "Referer": "rapidAPI",
                "User-Agent": "rapidAPI",
                "x-rapidapi-host": process.env.SALVAGE_HOST!,
                "x-rapidapi-key": process.env.RAPID_API_KEY!,
            },
        });

        if (!response.ok) {
            throw businessError('Error while obtaining salvage')
        }

        let salvageWasFound: boolean | undefined = undefined

        try {
            const result = await response.json();
            salvageWasFound = !!result
        }
        catch {
            // We arrive here when undefined is returned from 3rd party API and 
            // it can't be used as JSON. We assume it's salvage or total loss case.
            salvageWasFound = true
        }

        return { salvageWasFound }
    },
    onSuccess: async ({ flags, result, requestPayload }) => {
        if (!flags[VinAPIFlags.DATA_WAS_TAKEN_FROM_CACHE]) {
            await prismaClient.salvageInfo.create({
                data: { salvageWasFound: result.salvageWasFound, vin: requestPayload.vin }
            })
        }
        const isDemo = isDemoVin({ payload: requestPayload })
        if (!isDemo) {
            await ActionsHistoryService.Register({ target: "salvage", payload: { vin: requestPayload.vin, result: result.salvageWasFound } })
        }
    },
    beforehandler: noSubscriptionsGuard,
    ignoreBeforeHandler: isDemoVin
})


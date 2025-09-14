import { VinSchema } from "@/schemas"
import z from "zod"
import { zodApiMethod, ZodAPIMethod } from "../../zod-api-methods"
import { prismaClient } from "@/infrastructure"
import { ActionsHistoryService } from "@/services"

const queryParamsSchema = z.object({
    vin: VinSchema
})

const resultSchema = z.object({
    salvageWasFound: z.boolean()
})

export type Method = ZodAPIMethod<typeof queryParamsSchema, undefined, typeof resultSchema>

export const handler = zodApiMethod(queryParamsSchema, undefined, resultSchema, async (payload) => {
    const response = await fetch(`${process.env.SALVAGE_ENDPOINT!}?vin=${payload.vin}`, {
        method: "GET",
        headers: {
            "Referer": "rapidAPI",
            "User-Agent": "rapidAPI",
            "x-rapidapi-host": process.env.SALVAGE_HOST!,
            "x-rapidapi-key": process.env.RAPID_API_KEY!,
        },
    });

    let salvageWasFound = true

    try {
        const result = await response.json();
        if (typeof result === 'boolean') {
            salvageWasFound = result
        }
    }
    catch {
    }

    await prismaClient.salvageInfo.deleteMany({ where: { vin: payload.vin } })
    await prismaClient.salvageInfo.create({
        data: { salvageWasFound, vin: payload.vin }
    })
    await ActionsHistoryService.Register({ target: "salvage", payload: { vin: payload.vin, result: salvageWasFound } })


    return { salvageWasFound }
})

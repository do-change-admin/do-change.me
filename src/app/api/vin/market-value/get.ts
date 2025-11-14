import z from "zod";
import { ZodAPIMethod, zodApiMethod, ZodAPISchemas } from "../../../../backend/utils/zod-api-controller____DEPRECATED.utils";
import { businessError } from "@/lib-deprecated/errors";
import { prismaClient } from "@/backend/infrastructure";
import { ActionsHistoryService } from "@/backend/services";
import { noSubscriptionGuard } from "@/backend/controllers/api-guards/no-subscription.api-guard";
import { isDemoVin, VinAPIFlags } from "../vin-api.helpers";
import { VIN } from "@/value-objects/vin.value-object";

export const marketPricesSchema = z.object({
    market_prices: z.object({
        average: z.number(),
        below: z.number(),
        above: z.number(),
        distribution: z.array(
            z.object({
                group: z.object({
                    count: z.number(),
                    max: z.number(),
                    min: z.number()
                })
            })
        )
    })
})

const schemas = {
    body: undefined,
    query: z.object({
        vin: VIN.schema,
        mileage: z.coerce.number(),
    }),
    response: marketPricesSchema
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>


export const method = zodApiMethod(schemas, {
    handler: async ({ payload, flags }) => {
        const cachedData = await prismaClient.marketPriceAnalysisResult.findMany({
            where: { vin: payload.vin, mileage: payload.mileage }
        })

        if (cachedData.length) {
            flags[VinAPIFlags.DATA_WAS_TAKEN_FROM_CACHE] = true
            return { market_prices: cachedData[0] }
        }

        const apiAnswer = await fetch(
            `${process.env.MARKET_VALUE_ENDPOINT}/vmv?vin=${payload.vin}&mileage=${payload.mileage}`,
            {
                headers: {
                    "x-rapidapi-key": process.env.RAPID_API_KEY!,
                    "x-rapidapi-host": process.env.MARKET_VALUE_HOST!,
                }
            }
        );


        const json = await apiAnswer.json();
        const marketPrices = json?.market_prices;
        if (!marketPrices) {
            throw businessError('No prices were found for this car', undefined, 404)
        }

        return { market_prices: marketPrices }
    },

    onSuccess: async ({ result, requestPayload, flags }) => {
        if (!flags[VinAPIFlags.DATA_WAS_TAKEN_FROM_CACHE]) {
            await prismaClient.marketPriceAnalysisResult.create({
                data: {
                    vin: requestPayload.vin,
                    mileage: requestPayload.mileage,
                    above: result.market_prices.above,
                    average: result.market_prices.average,
                    below: result.market_prices.below,
                    distribution: result.market_prices.distribution ?? []
                }
            })

        }
        const isDemo = await isDemoVin({ payload: requestPayload })
        if (!isDemo) {
            await ActionsHistoryService.Register({
                target: "market value", payload: {
                    vin: requestPayload.vin,
                    mileage: requestPayload.mileage,
                    result: { market_prices: result.market_prices }
                }
            })
        }
    },
    beforehandler: noSubscriptionGuard,
    ignoreBeforeHandler: isDemoVin
})
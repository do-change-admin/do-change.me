import z from "zod";
import { ZodAPIMethod, zodApiMethod } from "../../zod-api-methods";
import { VinSchema } from "@/schemas";
import { businessError } from "@/lib/errors";
import { prismaClient } from "@/infrastructure";
import { ActionsHistoryService, ProfileService } from "@/services";
import { EmailAddress } from "@/value-objects/email-address.vo";
import { PublicFolderFileSystemProvider } from "@/providers/implementations";

const schemas = {
    body: undefined,
    query: z.object({
        vin: VinSchema,
        mileage: z.coerce.number(),
    }),
    response: z.object({
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
}

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload }) => {
        const marketValueURL = process.env.MARKET_VALUE_ENDPOINT
        if (!marketValueURL) {
            return {
                market_prices: {
                    above: 9000.12,
                    average: 8900.14,
                    below: 8771.241,
                    distribution: []
                }
            }
        }

        const apiAnswer = await fetch(
            `${marketValueURL}/vmv?vin=${payload.vin}&mileage=${payload.mileage}`,
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

        return marketPrices
    },

    onSuccess: async ({ result, requestPayload }) => {
        await prismaClient.marketPriceAnalysisResult.deleteMany({
            where: {
                vin: requestPayload.vin,
                mileage: requestPayload.mileage
            }
        })
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
        await ActionsHistoryService.Register({
            target: "market value", payload: {
                vin: requestPayload.vin,
                mileage: requestPayload.mileage,
                result: { market_prices: result.market_prices }
            }
        })
    },

    beforehandler: async ({ activeUser }) => {
        const service = new ProfileService(
            EmailAddress.create(activeUser.email),
            new PublicFolderFileSystemProvider()
        )
        const { subscription } = await service.profileData() || {}

        if (!subscription) {
            throw businessError('No subscription was found', undefined, 401)
        }
    }
})
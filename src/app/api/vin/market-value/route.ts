import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { PricesResultDTO } from './models';
import { ActionsHistoryService } from '@/services';
import { prismaClient } from '@/infrastructure';

const queryParams = z.object({
    vin: z.string().min(17),
    mileage: z.coerce.number(),
})

export async function GET(
    req: NextRequest
) {
    const { success, data, error } = queryParams.safeParse({ vin: req.nextUrl.searchParams.get('vin'), mileage: req.nextUrl.searchParams.get('mileage') })
    if (!success) {
        return NextResponse.json(error, { status: 400 })
    }
    try {
        const marketValueURL = process.env.MARKET_VALUE_ENDPOINT
        if (!marketValueURL) {
            const mockResult: PricesResultDTO = {
                market_prices: {
                    above: 9000.12,
                    average: 8900.14,
                    below: 8771.241,
                    distribution: []
                }
            }
            try {
                if (data.mileage) {
                    ActionsHistoryService.Register({
                        target: "market value", payload: {
                            vin: data.vin,
                            mileage: data.mileage,
                            result: mockResult
                        }
                    })

                }
            } catch { }
            return NextResponse.json(mockResult)
        }

        const apiAnswer = await fetch(
            `${marketValueURL}/vmv?vin=${data.vin}&mileage=${data.mileage}`,
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
            return NextResponse.json({ data: "No market prices were found for this car" }, { status: 400 })
        }

        await prismaClient.marketPriceAnalysisResult.deleteMany({
            where: {
                vin: data.vin,
                mileage: data.mileage
            }
        })
        await prismaClient.marketPriceAnalysisResult.create({
            data: {
                vin: data.vin,
                mileage: data.mileage,
                above: marketPrices.above,
                average: marketPrices.average,
                below: marketPrices.below,
                distribution: marketPrices.distribution ?? []
            }
        })

        try {
            ActionsHistoryService.Register({
                target: "market value", payload: {
                    vin: data.vin,
                    mileage: data.mileage,
                    result: { market_prices: json?.market_prices }
                }
            })
        } catch { }
        return NextResponse.json(json)
    }
    catch (e) {
        return NextResponse.json(e, { status: 500 })
    }
}

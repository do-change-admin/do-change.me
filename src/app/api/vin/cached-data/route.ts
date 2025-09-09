import { NextRequest, NextResponse } from "next/server"
import { prismaClient } from '@/infrastructure'
import { VinSchema } from "@/schemas"
import { CarReport, VinCheckResult } from "@prisma/client"
import { PricesResultDTO } from "../market-value/models"
import { CachedData_GET_Response, mapReportFromPrismaToReportData } from "./models"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const vinFromRequest = searchParams.get('vin')
    const { success, data: vin, error } = VinSchema.safeParse(vinFromRequest)
    if (!success) {
        return NextResponse.json(error, { status: 400 })
    }

    const cachedBaseInfoData = await prismaClient.vinCheckResult.findFirst({
        where: { VIN: vin }
    });

    const marketPriceInfoData = await prismaClient.marketPriceAnalysisResult.findMany({
        where: { vin }
    })

    const reportsData = await prismaClient.carReport.findMany({
        where: { vin }
    })
    const autoCheckReport = reportsData.find(x => x.source === 'AUTOCHECK')
    const carfaxReport = reportsData.find(x => x.source === 'CARFAX')

    const salvageData = await prismaClient.salvageInfo.findFirst({
        where: { vin }
    })


    return NextResponse.json<CachedData_GET_Response>({
        baseInfo: cachedBaseInfoData,
        salvage: salvageData ? salvageData.salvageWasFound : null,
        marketAnalysis: marketPriceInfoData?.map(marketPriceInfoData => ({
            mileage: marketPriceInfoData.mileage,
            market_prices: {
                above: marketPriceInfoData.above,
                average: marketPriceInfoData.average,
                below: marketPriceInfoData.below,
                distribution: marketPriceInfoData.distribution as PricesResultDTO['market_prices']['distribution']
            }
        })) ?? [],
        autocheckReportData: autoCheckReport ? mapReportFromPrismaToReportData(autoCheckReport) : null,
        carfaxReportData: carfaxReport ? mapReportFromPrismaToReportData(carfaxReport) : null,
        cachedDataStatus: {
            baseInfoWasFound: !!cachedBaseInfoData,
            marketPricesWereFound: marketPriceInfoData?.map((mil) => mil.mileage),
            salvageInfoWasFound: typeof salvageData?.salvageWasFound === "boolean",
            reports: {
                autocheckWasDownloaded: !!autoCheckReport,
                carfaxWasDownloaded: !!carfaxReport,
            }
        }
    })

}
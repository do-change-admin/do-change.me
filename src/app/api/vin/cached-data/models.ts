import { CarReport, VinCheckResult } from "@prisma/client"
import { PricesResultDTO } from "../market-value/models"

export type ReportData = {
    generatedAt: Date,
    type: "pdf" | "html" | "text",
    data: string
}

export const mapReportFromPrismaToReportData = (prismaData: CarReport): ReportData => {
    return {
        data: prismaData.data,
        generatedAt: prismaData.generatedAt,
        type: prismaData.type as ReportData['type']
    }
}

export type CacheStatus = {
    baseInfoWasFound: boolean,
    marketPricesWereFound: number[],
    salvageInfoWasFound: boolean,
    reports: {
        carfaxWasDownloaded: boolean,
        autocheckWasDownloaded: boolean
    }

}

export type CachedData_GET_Response = {
    cachedDataStatus: CacheStatus,
    baseInfo: VinCheckResult | null,
    marketAnalysis: (PricesResultDTO & { mileage: number })[],
    carfaxReportData: ReportData | null,
    autocheckReportData: ReportData | null,
    salvage: boolean | null
}

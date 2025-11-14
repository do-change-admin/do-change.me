import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/backend/infrastructure";
import {
    CachedData_GET_Response,
    mapReportFromPrismaToReportData,
} from "./models";
import { VIN } from "@/value-objects/vin.value-object";
import { DIContainer } from "@/backend/di-containers";
import { ErrorFactory } from "@/value-objects/errors.value-object";

const errorFactory = ErrorFactory.forController("vin / cached-data");

export const GET = async (req: NextRequest) => {
    const loggerProvider = DIContainer().LoggerProvider();

    const searchParams = req.nextUrl.searchParams;
    const vinFromRequest = searchParams.get("vin");
    const { success, data: vin, error } = VIN.schema.safeParse(vinFromRequest);
    if (!success) {
        const newError = errorFactory.inMethod("GET").newError({
            error: "Could not obtain cached-data",
            statusCode: 400,
            details: vinFromRequest,
        });

        loggerProvider.error(newError);

        return NextResponse.json(error, { status: 400 });
    }

    try {
        const cachedBaseInfoData = await prismaClient.vinCheckResult.count({
            where: { VIN: vin },
        });

        const marketPriceInfoData =
            await prismaClient.marketPriceAnalysisResult.findMany({
                where: { vin },
            });

        const reportsData = await prismaClient.carReport.findMany({
            where: { vin },
        });
        const autoCheckReport = reportsData.find(
            (x) => x.source === "AUTOCHECK"
        );
        const carfaxReport = reportsData.find((x) => x.source === "CARFAX");

        const salvageData = await prismaClient.salvageInfo.findFirst({
            where: { vin },
        });

        return NextResponse.json<CachedData_GET_Response>({
            salvage: salvageData ? salvageData.salvageWasFound : null,
            autocheckReportData: autoCheckReport
                ? mapReportFromPrismaToReportData(autoCheckReport)
                : null,
            carfaxReportData: carfaxReport
                ? mapReportFromPrismaToReportData(carfaxReport)
                : null,
            cachedDataStatus: {
                baseInfoWasFound: !!cachedBaseInfoData,
                marketPricesWereFound: marketPriceInfoData?.map(
                    (mil) => mil.mileage
                ),
                salvageInfoWasFound:
                    typeof salvageData?.salvageWasFound === "boolean",
                reports: {
                    autocheckWasDownloaded: !!autoCheckReport,
                    carfaxWasDownloaded: !!carfaxReport,
                },
            },
        });
    } catch (e: any) {
        const newError = errorFactory.inMethod("GET").newError(
            {
                error: "Could not obtain cached data",
                statusCode: e.statusCode ?? 500,
                details: { payload: vinFromRequest },
            },
            e
        );

        loggerProvider.error(newError);
    }
};

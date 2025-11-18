import { ZodController, ZodControllerAPI } from "@/backend/utils/zod-controller.utils";
import metadata from "./vehicle-analysis.controller.metadata";
import { inject, injectable } from "inversify";
import { StoreTokens } from "@/backend/di-containers/tokens.di-container";
import { type DataProviders } from "@/backend/providers";
import { noSubscriptionGuard } from "@/backend/utils/api-guards/no-subscription.api-guard";
import { RequestsMeteringService } from "@/backend/services/requests-metering/requests-metering.service";
import { FeatureKey } from "@/value-objects/feature-key.vo";
import { ActionsHistoryService } from "@/backend/services";
import z from "zod";

type VehicleHistoryReportStore = DataProviders.VehicleHistoryReports.Interface

@injectable()
export class VehicleAnalysisController extends ZodController(metadata) {
    public constructor(
        @inject(StoreTokens.vehicleHistoryReports) private readonly reports: VehicleHistoryReportStore
    ) {
        super()
    }

    GET_Report = this.loggedEndpoint('GET_Report', {
        handler: async ({ payload: { vin } }) => {
            // TODO - extract logic in service, combine this call with cache which will be extracted from reports
            const report = await this.reports.findOne({ vin })
            return {
                htmlMarkup: report.htmlMarkup
            }
        },
        beforehandler: noSubscriptionGuard,
        onSuccess: async ({ activeUser, requestPayload, result }) => {
            let shouldIncrementCounter = true
            try {
                // TODO - extract Actions History Service in DI, refactor
                const history = await ActionsHistoryService.ShowCurrentHistory()
                const vinsInUserHistory = Object.keys(history)
                const userAlreadyRequestedReportForThisCar = vinsInUserHistory.includes(requestPayload.vin) && !!history[requestPayload.vin].carfax?.data
                if (userAlreadyRequestedReportForThisCar) {
                    shouldIncrementCounter = false;
                }
            } catch {
                // TODO - extract in service with proper error check
            }
            if (shouldIncrementCounter) {
                const service = new RequestsMeteringService(activeUser.id)
                await service.incrementUsage(FeatureKey.Report)
                await ActionsHistoryService.Register({
                    target: 'report' as const,
                    payload: {
                        vin: requestPayload.vin,
                        service: 'carfax',
                        result: { type: 'html', data: result.htmlMarkup }
                    }
                })
            }
        },

    })
}

export type VehicleAnalysisAPI = ZodControllerAPI<typeof metadata.schemas, {
    HistoryReport: z.infer<typeof metadata.schemas.GET_Report.response>
}>
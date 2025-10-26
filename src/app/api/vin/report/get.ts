import z from "zod";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { RequestsMeteringService } from "@/backend/services/requests-metering/requests-metering.service";
import { FeatureKey } from "@/value-objects/feature-key.vo";
import { DIContainer } from "@/backend/di-containers";
import { DataProviders } from "@/backend/providers";
import { DataProviderTokens } from "@/backend/di-containers/tokens.di-container";
import { noSubscriptionGuard } from "@/backend/api-guards/no-subscription.api-guard";
import { ActionsHistoryService } from "@/backend/services";
import { VIN } from "@/value-objects/vin.value-object";

const FROM_CACHE_FLAG = 'FROM_CACHE'

const schemas = {
    body: undefined,
    query: z.object({
        vin: VIN.schema,
    }),
    response: z.object({
        htmlMarkup: z.string().nonempty(),
    })
} satisfies ZodAPISchemas

export type Method = ZodAPIMethod<typeof schemas>

export const method = zodApiMethod(schemas, {
    handler: async ({ payload: { vin }, flags }) => {
        // TODO - вынести в сервис
        const reportsDataProvider = DIContainer()._context.get<DataProviders.VehicleHistoryReports.Interface>(
            DataProviderTokens.vehicleHistoryReports
        )
        const reportsCache = DIContainer()._context.get<DataProviders.VehicleHistoryReports.CacheInterface>(
            DataProviderTokens.vehicleHistoryReportsCache
        )
        const reportFromCache = await reportsCache.find(vin)
        if (reportFromCache) {
            flags[FROM_CACHE_FLAG] = true
            return {
                htmlMarkup: reportFromCache.report
            }
        }
        const report = await reportsDataProvider.findOne({ vin })
        try {
            await reportsCache.create(vin, report.htmlMarkup)
        }
        // todo - обработка ошибки будет в сервисе
        catch { }
        return {
            htmlMarkup: report.htmlMarkup
        }
    },
    onSuccess: async ({ activeUser, flags, requestPayload, result }) => {
        if (!flags[FROM_CACHE_FLAG]) {
            const service = new RequestsMeteringService(activeUser.id)
            await service.incrementUsage(FeatureKey.Report)
        }
        await ActionsHistoryService.Register({
            target: 'report' as const,
            payload: {
                vin: requestPayload.vin,
                service: 'carfax',
                result: { type: 'html', data: result.htmlMarkup }
            }
        })
    },
    beforehandler: noSubscriptionGuard
})
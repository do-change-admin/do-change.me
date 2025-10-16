import z from "zod";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { VinSchema } from "@/schemas";
import { RequestsMeteringService } from "@/services/requests-metering/requests-metering.service";
import { FeatureKey } from "@/value-objects/feature-key.vo";
import { DIContainer } from "@/di-containers";
import { DataProviders } from "@/providers";
import { DataProviderTokens } from "@/di-containers/tokens.di-container";
import { noSubscriptionsGuard } from "@/api-guards";

const FROM_CACHE_FLAG = 'FROM_CACHE'

const schemas = {
    body: undefined,
    query: z.object({
        vin: VinSchema,
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
    onSuccess: async ({ activeUser, flags }) => {
        if (flags[FROM_CACHE_FLAG]) {
            return
        }
        const service = new RequestsMeteringService(activeUser.id)
        await service.incrementUsage(FeatureKey.Report)
    },
    beforehandler: noSubscriptionsGuard
})
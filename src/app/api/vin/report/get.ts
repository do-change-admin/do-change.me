import z from 'zod';
import { noSubscriptionGuard } from '@/backend/api-guards/no-subscription.api-guard';
import { DIContainer } from '@/backend/di-containers';
import { DIStores } from '@/backend/di-containers/tokens.di-container';
import type { DataProviders } from '@/backend/providers';
import { ActionsHistoryService } from '@/backend/services';
import { RequestsMeteringService } from '@/backend/services/requests-metering/requests-metering.service';
import { FeatureKey } from '@/value-objects/feature-key.vo';
import { VIN } from '@/value-objects/vin.value-object';
import {
    type ZodAPIMethod,
    type ZodAPISchemas,
    zodApiMethod
} from '../../../../backend/DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';

const FROM_CACHE_FLAG = 'FROM_CACHE';

const schemas = {
    body: undefined,
    query: z.object({
        vin: VIN.schema
    }),
    response: z.object({
        htmlMarkup: z.string().nonempty(),
        source: z.string().optional()
    })
} satisfies ZodAPISchemas;

export type Method = ZodAPIMethod<typeof schemas>;

export const method = zodApiMethod(schemas, {
    handler: async ({ payload: { vin } }) => {
        // TODO - вынести в сервис
        const reportsDataProvider = DIContainer()._context.get<DataProviders.VehicleHistoryReports.Interface>(
            DIStores.vehicleHistoryReports
        );
        // const reportsCache = DIContainer()._context.get<DataProviders.VehicleHistoryReports.CacheInterface>(
        //     StoreTokens.vehicleHistoryReportsCache
        // )
        // const reportFromCache = await reportsCache.find(vin)
        // if (reportFromCache) {
        //     flags[FROM_CACHE_FLAG] = true
        //     return {
        //         htmlMarkup: reportFromCache.report,
        //     }
        // }
        const report = await reportsDataProvider.findOne({ vin });
        // try {
        //     await reportsCache.create(vin, report.htmlMarkup)
        // }
        // todo - обработка ошибки будет в сервисе
        // catch { }
        return {
            htmlMarkup: report.htmlMarkup,
            // @ts-expect-error
            source: report.source
        };
    },
    onSuccess: async ({ activeUser, flags, requestPayload, result }) => {
        if (!flags[FROM_CACHE_FLAG]) {
            const service = new RequestsMeteringService(activeUser.id);
            await service.incrementUsage(FeatureKey.Report);
        }
        await ActionsHistoryService.Register({
            target: 'report' as const,
            payload: {
                vin: requestPayload.vin,
                service: 'carfax',
                result: { type: 'html', data: result.htmlMarkup }
            }
        });
    },
    beforehandler: noSubscriptionGuard
});

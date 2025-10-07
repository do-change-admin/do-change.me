import z from "zod";
import { zodApiMethod, ZodAPIMethod, ZodAPISchemas } from "../../zod-api-methods";
import { VinSchema } from "@/schemas";
import { RequestsMeteringService } from "@/services/requests-metering/requests-metering.service";
import { FeatureKey } from "@/value-objects/feature-key.vo";
import { businessError } from "@/lib/errors";
import { noSubscriptionsGuard } from "@/api-guards";
import { getDIContainer } from "@/di-containers";
import { DataProviders } from "@/providers";
import { DataProviderTokens } from "@/di-containers/tokens.di-container";

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
    handler: async ({ payload: { vin } }) => {
        const container = getDIContainer()
        const reportsDataProvider = container.get<DataProviders.VehicleHistoryReports.Interface>(
            DataProviderTokens.vehicleHistoryReports
        )
        const report = await reportsDataProvider.findReport({ vin })
        return {
            htmlMarkup: report.htmlMarkup
        }
    },
    onSuccess: async ({ activeUser }) => {
        const service = new RequestsMeteringService(activeUser.id)
        await service.incrementUsage(FeatureKey.Report)
    },
    // beforehandler: noSubscriptionsGuard
})
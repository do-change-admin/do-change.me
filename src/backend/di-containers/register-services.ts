import { Container } from "inversify"
import { DataProviderTokens, ServiceTokens } from "./tokens.di-container"
import { DataProviders } from "@/backend/providers"
import { Services } from "@/backend/services"
import { SyndicationRequestsService } from "@/backend/services/syndication-requests.service"
import { SyndicationRequestDraftsService } from "@/backend/services/syndication-request-drafts.service"
import { SyndicationRequestManagementService } from "@/backend/services/syndication-request-management.service"

export type SyndicationRequestsServiceFactory = (userId: string) => SyndicationRequestsService
export type SyndicationRequestDraftsServiceFactory = (userId: string) => SyndicationRequestDraftsService

export const registerServices = (container: Container) => {
    container.
        bind<SyndicationRequestsServiceFactory>(ServiceTokens.syndicationRequestsFactory)
        .toFactory(ctx => {
            return (userId) => {
                const dataProvider = ctx.get<DataProviders.SyndicationRequests.Interface>(DataProviderTokens.syndicationRequests)
                const draftsDataProvider = ctx.get<DataProviders.SyndicationRequestDrafts.Interface>(DataProviderTokens.syndicationRequestDrafts)

                const picturesDataProvider = ctx.get<DataProviders.Pictures.Interface>(DataProviderTokens.pictures)
                return new SyndicationRequestsService(
                    dataProvider,
                    draftsDataProvider,
                    picturesDataProvider,
                    userId
                )
            }
        })

    container.
        bind<SyndicationRequestDraftsServiceFactory>(ServiceTokens.syndicationRequestDraftsFactory)
        .toFactory(ctx => {
            return (userId) => {
                const dataProvider = ctx.get<DataProviders.SyndicationRequestDrafts.Interface>(DataProviderTokens.syndicationRequestDrafts)
                const requestsDataProvider = ctx.get<DataProviders.SyndicationRequests.Interface>(DataProviderTokens.syndicationRequests)

                const picturesDataProvider = ctx.get<DataProviders.Pictures.Interface>(DataProviderTokens.pictures)
                return new SyndicationRequestDraftsService(
                    dataProvider,
                    requestsDataProvider,
                    picturesDataProvider,
                    userId
                )
            }
        })

    container
        .bind<SyndicationRequestManagementService>(ServiceTokens.syndicationRequestManagement)
        .to(SyndicationRequestManagementService)
}

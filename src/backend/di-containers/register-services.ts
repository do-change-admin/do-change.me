import { Container } from "inversify"
import { DIStores, ServiceTokens } from "./tokens.di-container"
import { DataProviders } from "@/backend/providers"
import { SyndicationRequestsService } from "@/backend/services/syndication-requests.service"
import { SyndicationRequestDraftsService } from "@/backend/services/syndication-request-drafts.service"
import { SyndicationRequestManagementService } from "@/backend/services/syndication-request-management.service"
import { UserNotificationsService } from "../services/user-notifications.service"
import type { NotificationStore } from "../stores/interfaces/notification.store"
import { UserNotificationsManagementService } from "../services/user-notifications-management.service"

export type SyndicationRequestsServiceFactory = (userId: string) => SyndicationRequestsService
export type SyndicationRequestDraftsServiceFactory = (userId: string) => SyndicationRequestDraftsService
export type UserNotificationsServiceFactory = (userId: string) => UserNotificationsService
export type UserNotificationsManagementServiceFactory = (userId: string) => UserNotificationsManagementService

export const registerServices = (container: Container) => {
    container.
        bind<SyndicationRequestsServiceFactory>(ServiceTokens.syndicationRequestsFactory)
        .toFactory(ctx => {
            return (userId) => {
                const dataProvider = ctx.get<DataProviders.SyndicationRequests.Interface>(DIStores.syndicationRequests)
                const draftsDataProvider = ctx.get<DataProviders.SyndicationRequestDrafts.Interface>(DIStores.syndicationRequestDrafts)

                const picturesDataProvider = ctx.get<DataProviders.Pictures.Interface>(DIStores.reserve_pictures)
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
                const dataProvider = ctx.get<DataProviders.SyndicationRequestDrafts.Interface>(DIStores.syndicationRequestDrafts)
                const requestsDataProvider = ctx.get<DataProviders.SyndicationRequests.Interface>(DIStores.syndicationRequests)

                const picturesDataProvider = ctx.get<DataProviders.Pictures.Interface>(DIStores.reserve_pictures)
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

    container
        .bind<UserNotificationsServiceFactory>(ServiceTokens.userNotificationsFactory)
        .toFactory((ctx) => {
            return (userId) => {
                const notifications = ctx.get<NotificationStore>(DIStores.notifications)
                return new UserNotificationsService(notifications, userId)
            }
        })

    container
        .bind<UserNotificationsManagementServiceFactory>(ServiceTokens.userNotificationsManagementFactory)
        .toFactory((ctx) => {
            return (userId) => {
                const notifications = ctx.get<NotificationStore>(DIStores.notifications)
                return new UserNotificationsManagementService(notifications, userId)
            }
        })
}

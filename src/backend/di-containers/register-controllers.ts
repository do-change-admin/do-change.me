import { Container } from "inversify";
import { ControllerTokens } from "./tokens.di-container";
import { SyndicationRequestsController } from "@/backend/controllers/syndication-requests.controller";
import { SyndicationRequestDraftsController } from "@/backend/controllers/syndication-request-drafts.controller";
import { SyndicationRequestManagementController } from "@/backend/controllers/syndication-request-management.controller";
import { UserNotificationsController } from "../controllers/user-notifications.controller";
import { UserNotificationsManagementController } from "../controllers/user-notifications-management.controller";
import { SubscriptionsController } from "../controllers/subscriptions.controller";

export const registerControllers = (container: Container) => {
    container.bind<SyndicationRequestsController>(ControllerTokens.syndicationRequests)
        .to(SyndicationRequestsController)
    container.bind<SyndicationRequestDraftsController>(ControllerTokens.syndicationRequestDrafts)
        .to(SyndicationRequestDraftsController)
    container.bind<SyndicationRequestManagementController>(ControllerTokens.syndicationRequestManagement)
        .to(SyndicationRequestManagementController)
    container.bind<UserNotificationsController>(ControllerTokens.userNotifications)
        .to(UserNotificationsController)
    container.bind<UserNotificationsManagementController>(ControllerTokens.userNotificationsManagement)
        .to(UserNotificationsManagementController)
    container.bind<SubscriptionsController>(ControllerTokens.subscriptions).to(SubscriptionsController)
}
import { Container } from "inversify";
import { ControllerTokens } from "./tokens.di-container";
import { SyndicationRequestsController } from "@/backend/controllers/syndication-requests.controller";
import { SyndicationRequestDraftsController } from "@/backend/controllers/syndication-request-drafts.controller";
import { SyndicationRequestManagementController } from "@/backend/controllers/syndication-request-management.controller";

export const registerControllers = (container: Container) => {
    container.bind<SyndicationRequestsController>(ControllerTokens.syndicationRequests)
        .to(SyndicationRequestsController)

    container.bind<SyndicationRequestDraftsController>(ControllerTokens.syndicationRequestDrafts)
        .to(SyndicationRequestDraftsController)

    container.bind<SyndicationRequestManagementController>(ControllerTokens.syndicationRequestManagement)
        .to(SyndicationRequestManagementController)
}
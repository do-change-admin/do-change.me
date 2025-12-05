import type { Container } from 'inversify';
import { RemotePicturesController } from '../controllers/remote-pictures';
import { SubscriptionsController } from '../controllers/subscriptions.controller';
import { UserNotificationsController } from '../controllers/user-notifications.controller';
import { UserNotificationsManagementController } from '../controllers/user-notifications-management.controller';
import { UserSyndicationRequestDraftsController } from '../controllers/user-syndication-request-drafts';
import { UserSyndicationRequestsController } from '../controllers/user-syndication-requests';
import { UserSyndicationRequestsManagementController } from '../controllers/user-syndication-requests-management';
import { ControllerTokens } from './tokens.di-container';

export const registerControllers = (container: Container) => {
    container
        .bind<UserSyndicationRequestsController>(ControllerTokens.syndicationRequests)
        .to(UserSyndicationRequestsController);
    container
        .bind<UserSyndicationRequestDraftsController>(ControllerTokens.syndicationRequestDrafts)
        .to(UserSyndicationRequestDraftsController);
    container
        .bind<UserSyndicationRequestsManagementController>(ControllerTokens.syndicationRequestManagement)
        .to(UserSyndicationRequestsManagementController);
    container.bind<UserNotificationsController>(ControllerTokens.userNotifications).to(UserNotificationsController);
    container
        .bind<UserNotificationsManagementController>(ControllerTokens.userNotificationsManagement)
        .to(UserNotificationsManagementController);
    container.bind<SubscriptionsController>(ControllerTokens.subscriptions).to(SubscriptionsController);
    container.bind<RemotePicturesController>(ControllerTokens.remotePictures).to(RemotePicturesController);
};

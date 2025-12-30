import type { Container } from 'inversify';
import { RemotePicturesController } from '../controllers/remote-pictures';
import { SubscriptionsController } from '../controllers/subscriptions.controller';
import { SyndicationRequestsManagementController } from '../controllers/syndication-requests/management';
import { UserSyndicationRequestsController } from '../controllers/syndication-requests/user';
import { UserSyndicationRequestDraftsController } from '../controllers/syndication-requests/user-drafts';
import { UserIdentityController } from '../controllers/user-identity';
import { UserNotificationsController } from '../controllers/user-notifications.controller';
import { UserNotificationsManagementController } from '../controllers/user-notifications-management.controller';
import { ControllerTokens } from './tokens.di-container';

export const registerControllers = (container: Container) => {
    container
        .bind<UserSyndicationRequestsController>(ControllerTokens.syndicationRequests)
        .to(UserSyndicationRequestsController);
    container
        .bind<UserSyndicationRequestDraftsController>(ControllerTokens.syndicationRequestDrafts)
        .to(UserSyndicationRequestDraftsController);
    container
        .bind<SyndicationRequestsManagementController>(ControllerTokens.syndicationRequestManagement)
        .to(SyndicationRequestsManagementController);
    container.bind<UserNotificationsController>(ControllerTokens.userNotifications).to(UserNotificationsController);
    container
        .bind<UserNotificationsManagementController>(ControllerTokens.userNotificationsManagement)
        .to(UserNotificationsManagementController);
    container.bind<SubscriptionsController>(ControllerTokens.subscriptions).to(SubscriptionsController);
    container.bind<RemotePicturesController>(ControllerTokens.remotePictures).to(RemotePicturesController);
    container.bind<UserIdentityController>(ControllerTokens.userIdentify).to(UserIdentityController);
};

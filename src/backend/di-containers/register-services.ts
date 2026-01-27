import type { Container } from 'inversify';
import { FeatureUsageManagementService } from '../services/feature-usage/management';
import { UserFeatureUsageMeteringService } from '../services/feature-usage/user-metering';
import { SyndicationRequestsManagementService } from '../services/syndication-requests/management';
import { UserSyndicationRequestsService } from '../services/syndication-requests/user';
import { UserSyndicationRequestDraftsService } from '../services/syndication-requests/user-drafts';
import { UserIdentityService } from '../services/user/identity';
import { UserSubscriptionService } from '../services/user/subscription';
import { UserNotificationsService } from '../services/user-notifications.service';
import { UserNotificationsManagementService } from '../services/user-notifications-management.service';
import type { NotificationStore } from '../stores/notification/notification.store';
import { DIServices, DIStores } from './tokens.di-container';

export type UserNotificationsServiceFactory = (userId: string) => UserNotificationsService;
export type UserNotificationsManagementServiceFactory = (userId: string) => UserNotificationsManagementService;

export const registerServices = (container: Container) => {
    container
        .bind<UserSyndicationRequestsService>(DIServices.userSyndicationRequests)
        .to(UserSyndicationRequestsService);

    container
        .bind<UserSyndicationRequestDraftsService>(DIServices.userSyndicationRequestDrafts)
        .to(UserSyndicationRequestDraftsService);

    container.bind<UserNotificationsServiceFactory>(DIServices.userNotificationsFactory).toFactory((ctx) => {
        return (userId) => {
            const notifications = ctx.get<NotificationStore>(DIStores.notifications);
            return new UserNotificationsService(notifications, userId);
        };
    });

    container
        .bind<UserNotificationsManagementServiceFactory>(DIServices.userNotificationsManagementFactory)
        .toFactory((ctx) => {
            return (userId) => {
                const notifications = ctx.get<NotificationStore>(DIStores.notifications);
                return new UserNotificationsManagementService(notifications, userId);
            };
        });

    container
        .bind<SyndicationRequestsManagementService>(DIServices.userSyndicationRequestManagement)
        .to(SyndicationRequestsManagementService);

    container
        .bind<UserFeatureUsageMeteringService>(DIServices.userFeatureUsageMetering)
        .to(UserFeatureUsageMeteringService);

    container.bind<FeatureUsageManagementService>(DIServices.featureUsageManagement).to(FeatureUsageManagementService);

    container.bind<UserIdentityService>(DIServices.userIdentity).to(UserIdentityService);
    container.bind<UserSubscriptionService>(DIServices.userSubscription).to(UserSubscriptionService);
};

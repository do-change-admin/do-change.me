import type { Container } from 'inversify';
import { UserNotificationsService } from '../services/user-notifications.service';
import { UserNotificationsManagementService } from '../services/user-notifications-management.service';
import { UserSyndicationRequestDraftsService } from '../services/user-syndication-request-drafts';
import { UserSyndicationRequestsService } from '../services/user-syndication-requests';
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
};

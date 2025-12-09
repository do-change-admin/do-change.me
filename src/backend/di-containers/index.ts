import 'reflect-metadata';

// import type { SyndicationRequestDraftsController } from '@/backend/controllers/syndication-request-drafts.controller';
// import type { SyndicationRequestManagementController } from '@/backend/controllers/syndication-request-management.controller';
import type { RemotePicturesController } from '../controllers/remote-pictures';
import type { SubscriptionsController } from '../controllers/subscriptions.controller';
import type { UserNotificationsController } from '../controllers/user-notifications.controller';
import type { UserNotificationsManagementController } from '../controllers/user-notifications-management.controller';
import type { UserSyndicationRequestDraftsController } from '../controllers/user-syndication-request-drafts';
import type { UserSyndicationRequestsController } from '../controllers/user-syndication-requests';
import type { UserSyndicationRequestsManagementController } from '../controllers/user-syndication-requests-management';
import type { IMailerProvider } from '../providers/mailer/mailer.provider';
import { devContainer } from './dev.di-container';
import { stageContainer } from './stage.di-container';
import { testContainer } from './test.di-container';
import { ControllerTokens, DIProviders } from './tokens.di-container';

const getDIContainer = () => {
    if (process.env.IN_TEST) {
        // контейнер для тестового окружения
        return testContainer;
    }

    if (process.env.IN_DEV) {
        // контейнер для локальной разработки
        return devContainer;
    }

    // контейнер для стейджа
    return stageContainer;
};

/**
 * Фасад для удобного получения зависимостей из DI-контейнера
 */
export const DIContainer = () => {
    const container = getDIContainer();

    return {
        /**
         * Использовать только для временных решений
         */
        _context: container,

        UserSyndicationRequestsController: () => {
            return container.get<UserSyndicationRequestsController>(ControllerTokens.syndicationRequests);
        },
        UserSyndicationRequestManagementController: () => {
            return container.get<UserSyndicationRequestsManagementController>(
                ControllerTokens.syndicationRequestManagement
            );
        },
        UserSyndicationRequestDraftsController: () => {
            return container.get<UserSyndicationRequestDraftsController>(ControllerTokens.syndicationRequestDrafts);
        },
        UserNotificationsController: () => {
            return container.get<UserNotificationsController>(ControllerTokens.userNotifications);
        },
        UserNotificationsManagementController: () => {
            return container.get<UserNotificationsManagementController>(ControllerTokens.userNotificationsManagement);
        },
        SubscriptionsController: () => {
            return container.get<SubscriptionsController>(ControllerTokens.subscriptions);
        },
        MailerProvider: () => {
            return container.get<IMailerProvider>(DIProviders.mailer);
        },
        RemotePicturesController: () => {
            return container.get<RemotePicturesController>(ControllerTokens.remotePictures);
        }
    };
};

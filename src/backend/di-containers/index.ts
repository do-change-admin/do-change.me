import 'reflect-metadata';

// import type { SyndicationRequestDraftsController } from '@/backend/controllers/syndication-request-drafts.controller';
// import type { SyndicationRequestManagementController } from '@/backend/controllers/syndication-request-management.controller';
import type { RemotePicturesController } from '../controllers/remote-pictures';
import type { SubscriptionsController } from '../controllers/subscriptions.controller';
import type { SyndicationRequestsManagementController } from '../controllers/syndication-requests/management';
import type { UserSyndicationRequestsController } from '../controllers/syndication-requests/user';
import type { UserSyndicationRequestDraftsController } from '../controllers/syndication-requests/user-drafts';
import type { UserIdentityController } from '../controllers/user-identity';
import type { UserNotificationsController } from '../controllers/user-notifications.controller';
import type { UserNotificationsManagementController } from '../controllers/user-notifications-management.controller';
import type { FunctionProviders } from '../providers';
import type { IMailerProvider } from '../providers/mailer/mailer.provider';
import type { UserIdentityService } from '../services/user-identity/user-identity.service';
import { devContainer } from './dev.di-container';
import { stageContainer } from './stage.di-container';
import { testContainer } from './test.di-container';
import { ControllerTokens, DIProviders, DIServices } from './tokens.di-container';

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
            return container.get<SyndicationRequestsManagementController>(
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
        },
        UserIdentityService: () => {
            return container.get<UserIdentityService>(DIServices.userIdentity);
        },
        UserIdentityController: () => {
            return container.get<UserIdentityController>(ControllerTokens.userIdentify);
        },
        Logger: () => {
            return container.get<FunctionProviders.Logger.Interface>(DIProviders.logger);
        }
    };
};

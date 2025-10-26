import 'reflect-metadata'

import { testContainer } from './test.di-container'
import { devContainer } from './dev.di-container'
import { stageContainer } from './stage.di-container'
import { ControllerTokens } from './tokens.di-container'
import type { SyndicationRequestsController } from '@/backend/controllers/syndication-requests.controller'
import type { SyndicationRequestDraftsController } from '@/backend/controllers/syndication-request-drafts.controller'
import type { SyndicationRequestManagementController } from '@/backend/controllers/syndication-request-management.controller'
import type { UserNotificationsController } from '../controllers/user-notifications.controller'

const getDIContainer = () => {
    if (process.env['IN_TEST']) {
        // контейнер для тестового окружения
        return testContainer
    }

    if (process.env['IN_DEV']) {
        // контейнер для локальной разработки
        return devContainer
    }

    // контейнер для стейджа
    return stageContainer
}

/**
 * Фасад для удобного получения зависимостей из DI-контейнера
 */
export const DIContainer = () => {
    const container = getDIContainer()

    return {
        /**
         * Использовать только для временных решений
         */
        _context: container,

        SyndicationRequestsController: () => {
            return container.get<SyndicationRequestsController>(ControllerTokens.syndicationRequests)
        },
        SyndicationRequestDraftsController: () => {
            return container.get<SyndicationRequestDraftsController>(ControllerTokens.syndicationRequestDrafts)
        },
        SyndicationRequestManagementController: () => {
            return container.get<SyndicationRequestManagementController>(ControllerTokens.syndicationRequestManagement)
        },
        UserNotificationsController: () => {
            return container.get<UserNotificationsController>(ControllerTokens.userNotifications)
        }
    }
}
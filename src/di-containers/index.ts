import 'reflect-metadata'

import { testContainer } from './test.di-container'
import { devContainer } from './dev.di-container'
import { stageContainer } from './stage.di-container'
import { ControllerTokens, ServiceTokens } from './tokens.di-container'
import { Services } from '@/services'
import type { SyndicationRequestsController } from '@/controllers/syndication-requests.controller'
import type { SyndicationRequestDraftsController } from '@/controllers/syndication-request-drafts.controller'
import type { SyndicationRequestManagementController } from '@/controllers/syndication-request-management.controller'

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
        /**
         * Использовать только для временных решений
         */
        _EmailService: () => {
            return container.get<Services.Email.Instance>(ServiceTokens.email)
        },

        SyndicationRequestsController: () => {
            return container.get<SyndicationRequestsController>(ControllerTokens.syndicationRequests)
        },
        SyndicationRequestDraftsController: () => {
            return container.get<SyndicationRequestDraftsController>(ControllerTokens.syndicationRequestDrafts)
        },
        SyndicationRequestManagementController: () => {
            return container.get<SyndicationRequestManagementController>(ControllerTokens.syndicationRequestManagement)
        }
    }
}
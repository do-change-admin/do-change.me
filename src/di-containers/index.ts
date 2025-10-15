import 'reflect-metadata'

import { testContainer } from './test.di-container'
import { devContainer } from './dev.di-container'
import { stageContainer } from './stage.di-container'
import { ControllerTokens, ServiceTokens } from './tokens.di-container'
import { Services } from '@/services'
import { CarSaleUserServiceFactory } from './register-services'
import { Controllers } from '@/controllers'

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
        _CarSaleUserService: (userId: string) => {
            return container.get<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)(userId)
        },
        /**
        * Использовать только для временных решений
        */
        _CarSaleAdminService: () => {
            return container.get<Services.CarSaleAdmin.Instance>(ServiceTokens.carSaleAdmin)
        },
        /**
         * Использовать только для временных решений
         */
        _EmailService: () => {
            return container.get<Services.Email.Instance>(ServiceTokens.email)
        },
        CarSaleUserController: () => {
            return container.get<Controllers.CarSale.User.Instance>(ControllerTokens.carSaleUser)
        }
    }
}
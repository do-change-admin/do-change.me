import 'reflect-metadata'

import { testContainer } from './test.di-container'
import { devContainer } from './dev.di-container'
import { stageContainer } from './stage.di-container'

export const getDIContainer = () => {
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
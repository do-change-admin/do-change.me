import 'reflect-metadata'

import { testContainer } from './test.di-container'

export const getDIContainer = () => {
    if (process.env['IN_TEST']) {
        return testContainer
    }

    if (process.env['IN_DEV']) {
        // вернуть dev-контейнер для локальной разработки
        return testContainer
    }

    // вернуть боевой контейнер
    return testContainer
}
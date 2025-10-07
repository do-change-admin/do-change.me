import 'reflect-metadata'

import { testContainer } from './test.di-container'

export const getDIContainer = () => {
    if (process.env['IN_TEST']) {
        return testContainer
    }

    // вернуть боевой контейнер
    return testContainer
}
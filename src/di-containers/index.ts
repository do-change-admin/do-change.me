import 'reflect-metadata'

import { testContainer } from './test.di-container'

export const getDIContainer = () => {
    return testContainer
}
import 'reflect-metadata'

import { testContainer } from './test.di-container'

export const getContainer = () => {
    return testContainer
}
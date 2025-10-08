import { test, expect, beforeEach } from 'vitest'
import { CarSaleUserService } from './car-sale.user-service'
import { testContainer } from '@/di-containers'
import { CarSaleUserServiceFactory, ServicesTokens } from '@/di-containers/tokens.di-container'
import { v4 } from 'uuid'

let service: CarSaleUserService

beforeEach(() => {
    const userId = v4()
    service = testContainer.get<CarSaleUserServiceFactory>(ServicesTokens.carSaleUserFactory)(userId)
})

test('empty by default', async () => {
    const items = await service.findList({ pageSize: 1000, zeroBasedIndex: 0 })
    expect(items.length).toBe(0)
})

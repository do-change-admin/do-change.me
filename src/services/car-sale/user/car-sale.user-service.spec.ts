import { test, expect, beforeEach } from 'vitest'
import { Instance } from './car-sale.user-service'
import { getDIContainer } from '@/di-containers'
import { CarSaleUserServiceFactory, ServiceTokens } from '@/di-containers/tokens.di-container'
import { v4 } from 'uuid'

let service: Instance


beforeEach(() => {
    const userId = v4()
    const container = getDIContainer()
    service = container.get<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)(userId)
})

test('empty by default', async () => {
    const items = await service.findList({ pageSize: 1000, zeroBasedIndex: 0 })
    expect(items.length).toBe(0)
})

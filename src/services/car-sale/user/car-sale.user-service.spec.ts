import { test, expect, beforeEach } from 'vitest'
import { Instance } from './car-sale.user-service'
import { DIContainer } from '@/di-containers'
import { v4 } from 'uuid'

let service: Instance

beforeEach(() => {
    const userId = v4()
    service = DIContainer().CarSaleUserService(userId)
})

test('empty by default', async () => {
    const items = await service.findList({ pageSize: 1000, zeroBasedIndex: 0 })
    expect(items.length).toBe(0)
})

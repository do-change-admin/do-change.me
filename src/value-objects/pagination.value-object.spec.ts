import { test, expect } from 'vitest'
import { Pagination } from './pagination.value-object'

test('valid creation', () => {
    const pagination = Pagination.create({
        pageSize: '1',
        zeroBasedIndex: '5'
    })
    expect(pagination.model.pageSize).toBe(1)
    expect(pagination.model.zeroBasedIndex).toBe(5)
})

test('next page', () => {
    const pagination = Pagination.create({
        pageSize: 10,
        zeroBasedIndex: 100
    })
    const { nextPage } = pagination

    expect(nextPage.model.pageSize).toBe(10)
    expect(nextPage.model.zeroBasedIndex).toBe(101)
})

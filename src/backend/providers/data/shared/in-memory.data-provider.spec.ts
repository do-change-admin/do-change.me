import { beforeEach, expect, test } from 'vitest'
import { CRUDActionsPayload, DataCRUDProvider, CRUDModels, CRUDSearchPayload } from './shared-types.data-providers'
import { generateInMemoryCRUDProvider } from './in-memory.data-provider'
import { v4 } from 'uuid'

type Detail = { id: string, name: string, extraField: string }
type List = { id: string, name: string }

type InMemoryDataProvider = DataCRUDProvider<
    CRUDModels<List, Detail>,
    CRUDSearchPayload<{}, { id: string, name: string }>,
    CRUDActionsPayload<{ name: string, extraField: string }, { extraField: string }>
>

const inMemoryProvider = generateInMemoryCRUDProvider<InMemoryDataProvider>()

let provider: InMemoryDataProvider

beforeEach(() => {
    provider = new inMemoryProvider()
})

test('empty by default', async () => {
    const items = await provider.list({ name: undefined }, { pageSize: 100, zeroBasedIndex: 0 })
    expect(items.length).toBe(0)
})

test('can find added item by id', async () => {
    const { id } = await provider.create({ name: 'hello', extraField: 'world' })
    const data = await provider.details({ id, name: 'hello' })
    expect(data).toBeTruthy()
    expect(data!.name).toBe('hello')
    expect(data!.extraField).toBe('world')
    expect(data!.id).toBe(id)
})

test('search by substring', async () => {
    const { id } = await provider.create({ name: 'sup', extraField: 'af' })
    const data = await provider.details({ id, name: 'su' })
    expect(data).toBeTruthy()
    expect(data!.extraField).toBe('af')
})

test('pagination', async () => {
    await provider.create({ name: v4(), extraField: v4() })
    await provider.create({ name: v4(), extraField: v4() })
    await provider.create({ name: v4(), extraField: v4() })
    await provider.create({ name: v4(), extraField: v4() })
    const firstPage = await provider.list({ name: undefined }, { pageSize: 2, zeroBasedIndex: 0 })
    expect(firstPage.length).toBe(2)
    const secondPage = await provider.list({ name: undefined }, { pageSize: 2, zeroBasedIndex: 1 })
    expect(secondPage.length).toBe(2)
    const thirdPage = await provider.list({ name: undefined }, { pageSize: 2, zeroBasedIndex: 2 })
    expect(thirdPage.length).toBe(0)
    const secondPageOfThree = await provider.list({ name: undefined }, { pageSize: 1, zeroBasedIndex: 3 })
    expect(secondPageOfThree.length).toBe(1)
})

test('with initial data', async () => {
    const inMemoryProviderWithData = generateInMemoryCRUDProvider<InMemoryDataProvider>({
        initialData: [{ extraField: '', id: '', name: 'asfsaf' }]
    })

    const dataProvider = new inMemoryProviderWithData()
    const data = await dataProvider.list({}, { pageSize: 1000, zeroBasedIndex: 0 })
    expect(data.length).toBe(1)
})
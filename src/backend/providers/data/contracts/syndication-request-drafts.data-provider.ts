import type { SyndicationRequestDraftModel } from '@/entities/syndication-request-draft.entity'
import type { ActionsPayload, Models, DataCRUDProvider, SearchPayload } from '../types'

// ITEM CONTRACTS
export type Details = Omit<SyndicationRequestDraftModel, 'photoLinks'> & {
    photoIds?: string[]
}
export type ListModel = Details

// SEARCH CONTRACTS
export type FindOnePayload = { id: string, userId: string }
export type FindListPayload = {
    userId: string;
} & Partial<{
    make: string;
    model: string;
    vin: string;
}>

// ACTION CONTRACTS
export type CreatePayload = Omit<Details, 'id'>
export type UpdatePayload = Partial<Omit<CreatePayload, 'userId'>>

export type FilterModels = { models: string[], makes: string[] }

// DATA PROVIDER INTERFACE
export type Interface = DataCRUDProvider<
    Models<ListModel, Details>,
    SearchPayload<FindListPayload, FindOnePayload>,
    ActionsPayload<CreatePayload, UpdatePayload>
> & {
    filtersData: (userId: string) => Promise<FilterModels>,
}
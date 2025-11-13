import type { SyndicationRequestModel } from '@/entities/syndication-request.entity'
import type { ActionsPayload, Models, DataCRUDProvider, SearchPayload } from '../types'
import type { SyndicationRequestActiveStatusNames } from '@/entities/sindycation-request-status.entity'

// ITEM CONTRACTS
export type Details = Omit<SyndicationRequestModel, 'photoLinks'> & {
    photoIds: string[]
}
export type ListModel = Details

// SEARCH CONTRACTS
export type FindOnePayload = { id: string, userId: string }
export type FindListPayload = Partial<{
    userId: string;
    status: SyndicationRequestActiveStatusNames;
    make: string;
    model: string;
    vin: string;
}>

// ACTION CONTRACTS
export type CreatePayload = Omit<Details, 'id' | 'userMail' | 'status' | 'marketplaceLinks'>;

export type UpdatePayload = Partial<{
    status: SyndicationRequestActiveStatusNames,
    marketplaceLinks: string[],
    photoIds: string[]
}>

export type FilterModels = { models: string[], makes: string[] }

// DATA PROVIDER INTERFACE
export type Interface = DataCRUDProvider<
    Models<ListModel, Details>,
    SearchPayload<FindListPayload, FindOnePayload>,
    ActionsPayload<CreatePayload, UpdatePayload>
> & {
    filtersData: (userId?: string) => Promise<FilterModels>,
}
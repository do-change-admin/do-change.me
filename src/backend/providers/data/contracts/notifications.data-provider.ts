import { NotificationModel } from '@/value-objects/notification.value-object'
import { ActionsPayload, Models, DataCRUDProvider, SearchPayload } from '../types'

// ITEM CONTRACTS
export type Details = NotificationModel
export type ListModel = NotificationModel

// SEARCH CONTRACTS
export type FindOnePayload = { id: string }
export type FindListPayload = { userId: string }

// ACTION CONTRACTS
export type CreatePayload = NotificationModel & { userId: string }
export type UpdatePayload = Partial<NotificationModel>

// DATA PROVIDER INTERFACE
export type Interface = DataCRUDProvider<
    Models<ListModel, Details>,
    SearchPayload<FindListPayload, FindOnePayload>,
    ActionsPayload<CreatePayload, UpdatePayload>
>
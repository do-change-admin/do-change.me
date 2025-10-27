import { NotificationModel } from '@/value-objects/notification.value-object'
import { ActionsPayload, Models, CRUDStore, SearchPayload } from '../helpers/abstract-models.store-helpers'
import { Id, UserId } from '@/backend/utils/shared-models.utils'

// ITEM CONTRACTS
type List = NotificationModel & Id
type Details = List & UserId

// SEARCH CONTRACTS
type FindOnePayload = Id
type FindListPayload = UserId & { seen?: boolean }

// ACTION CONTRACTS
type CreatePayload = Omit<Details, 'id' | 'seen'>
type UpdatePayload = Partial<Pick<Details, 'seen' | 'level'>>

// DATA PROVIDER INTERFACE
export type Notifications = CRUDStore<
    Models<List, Details>,
    SearchPayload<FindListPayload, FindOnePayload>,
    ActionsPayload<CreatePayload, UpdatePayload>
>
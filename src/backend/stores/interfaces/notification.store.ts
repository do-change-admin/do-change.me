import { NotificationModel } from '@/value-objects/notification.value-object'
import { ActionsPayload, Models, CRUDStore, SearchPayload } from '../helpers/abstract-models.store-helpers'
import { Id, UserId } from '@/backend/utils/shared-models.utils'

// ITEM CONTRACTS
export type NotificationList = NotificationModel & Id
export type NotificationDetails = NotificationList & UserId

// SEARCH CONTRACTS
export type FindNotificationPayload = Id
export type FindNotificationsPayload = UserId & { seen?: boolean }

// ACTION CONTRACTS
export type CreateNotificationPayload = Omit<NotificationDetails, 'id' | 'seen'>
export type UpdateNotificationPayload = Partial<Pick<NotificationDetails, 'seen' | 'level'>>

// DATA PROVIDER INTERFACE
export type NotificationStore = CRUDStore<
    Models<NotificationList, NotificationDetails>,
    SearchPayload<FindNotificationsPayload, FindNotificationPayload>,
    ActionsPayload<CreateNotificationPayload, UpdateNotificationPayload>
>
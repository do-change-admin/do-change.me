import { atom } from 'jotai'
import { UserNotificationDTO } from './notifications.user.feature.shared-models'

export const currentSelectedDetailsItemAtom = atom<UserNotificationDTO>()
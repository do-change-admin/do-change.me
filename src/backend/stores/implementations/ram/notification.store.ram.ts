import { Notifications } from '../../interfaces/notification.store.interface'
import { newStoreInRAM } from '../../helpers/in-memory-store.store-helpers'
import { v4 } from 'uuid'

const NotificationsFromRAM = newStoreInRAM<Notifications>({
    mappers: {
        createPayloadToDetail: (payload) => {
            return {
                id: v4(),
                level: payload.level,
                message: payload.message,
                seen: false,
                title: payload.title,
                userId: payload.userId
            }
        }
    }
})

export { NotificationsFromRAM }
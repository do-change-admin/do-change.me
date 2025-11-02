import { NotificationStore } from '../../interfaces/notification.store'
import { newInMemoryStore } from '../../helpers/in-memory-store.store-helpers'
import { v4 } from 'uuid'

const NotificationInMemoryStore = newInMemoryStore<NotificationStore>({
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

export { NotificationInMemoryStore }
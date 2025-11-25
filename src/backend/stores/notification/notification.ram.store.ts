import { RAMStore } from '@/backend/utils/store/store.utils.ram'
import type { NotificationStore } from './notification.store'
import { v4 } from 'uuid'

const NotificationRAMStore = RAMStore<NotificationStore>({
    mappers: {
        createPayloadToDetail: (payload) => {
            return {
                id: v4(),
                level: payload.level,
                message: payload.message,
                seen: false,
                title: payload.title,
                userId: payload.userId,
            }

        }
    }
})

export { NotificationRAMStore }
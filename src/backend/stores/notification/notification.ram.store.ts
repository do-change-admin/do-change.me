import { injectable } from 'inversify';
import { v4 } from 'uuid';
import { RAMStore } from '@/backend/utils/store/store.ram.utils';
import type { NotificationStore } from './notification.store';

const CRUDInRAM = RAMStore<NotificationStore>({
    mappers: {
        createPayloadToDetail: (payload) => {
            return {
                id: v4(),
                level: payload.level,
                message: payload.message,
                seen: false,
                title: payload.title,
                userId: payload.userId
            };
        }
    }
});

@injectable()
export class NotificationRAMStore extends CRUDInRAM implements NotificationStore {}

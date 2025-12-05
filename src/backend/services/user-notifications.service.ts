import { inject, injectable } from 'inversify';
import z from 'zod';
import { ErrorFactory } from '@/value-objects/errors.value-object';
import { Notification } from '@/value-objects/notification.value-object';
import { DIStores } from '../di-containers/tokens.di-container';
import type { NotificationStore } from '../stores/notification/notification.store';

export type NotificationDTO = z.infer<typeof UserNotificationsService.notificationDTO>;

const errorFactory = ErrorFactory.forService('notifications');

@injectable()
export class UserNotificationsService {
    static notificationDTO = Notification.modelSchema.extend({
        id: z.string().nonempty()
    });

    public constructor(
        @inject(DIStores.notifications) private readonly notifications: NotificationStore,
        private readonly userId: string
    ) {}

    allUnseen = async (): Promise<NotificationDTO[]> => {
        const data = await this.notifications.list(
            { userId: this.userId, seen: false },
            { pageSize: 1000, zeroBasedIndex: 0 }
        );

        return data;
    };

    all = async (): Promise<NotificationDTO[]> => {
        const data = await this.notifications.list({ userId: this.userId }, { pageSize: 1000, zeroBasedIndex: 0 });

        return data;
    };

    /**
     * Unsafe.
     */
    markAsRead = async (id: string) => {
        const errorGenerator = errorFactory.inMethod('markAsRead');

        const accordingNotification = await this.notifications.details({ id });

        if (!accordingNotification) {
            throw errorGenerator.newError({
                error: new Error('No according notification was found'),
                details: {
                    notificationId: id,
                    userId: this.userId
                }
            });
        }

        if (accordingNotification.userId !== this.userId) {
            throw errorGenerator.newError({
                error: new Error('Tried to read notification of another user'),
                details: {
                    notificationId: id,
                    userId: this.userId,
                    notificationUserId: accordingNotification.userId
                }
            });
        }

        return await this.notifications.updateOne({ id }, { seen: true });
    };
}

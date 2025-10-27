import { inject, injectable } from "inversify";
import { StoreTokens } from "../di-containers/tokens.di-container";
import type { Notifications } from "../stores/interfaces/notification.store.interface";
import z from "zod";

type UserNotificationPayload = z.infer<typeof UserNotificationsManagementService.notificationPayloadSchema>

@injectable()
export class UserNotificationsManagementService {
    static notificationPayloadSchema = z.object({
        title: z.string().nonempty(),
        message: z.string().nonempty()
    })

    public constructor(
        @inject(StoreTokens.notifications) private readonly notifications: Notifications,
        private readonly userId: string,
    ) { }

    notify = async ({ message, title }: UserNotificationPayload) => {
        return await this.notifications.create({
            level: 'warning',
            message,
            title,
            userId: this.userId
        })
    }

    notifyWithWarning = async ({ message, title }: UserNotificationPayload) => {
        return await this.notifications.create({
            level: 'info',
            message,
            title,
            userId: this.userId
        })
    }

    notifyAboutError = async ({ message, title }: UserNotificationPayload) => {
        return await this.notifications.create({
            level: 'error',
            message,
            title,
            userId: this.userId
        })
    }
}
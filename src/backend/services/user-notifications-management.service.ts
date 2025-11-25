import { inject, injectable } from "inversify";
import { StoreTokens } from "../di-containers/tokens.di-container";
import type { NotificationStore } from "../stores/notification/notification.store";
import z from "zod";
import { X } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";
import { prismaClient } from "../infrastructure";

type UserNotificationPayload = z.infer<typeof UserNotificationsManagementService.notificationPayloadSchema>

@injectable()
export class UserNotificationsManagementService {
    static notificationPayloadSchema = z.object({
        title: z.string().nonempty(),
        message: z.string().nonempty()
    })

    public constructor(
        @inject(StoreTokens.notifications) private readonly notifications: NotificationStore,
        private readonly userId: string,
    ) { }

    all = async () => {
        const data = await this.notifications.list({}, { pageSize: 1000, zeroBasedIndex: 0 })

        return data
    }

    availableUsers = () => {
        // ! TODO - extract in user store !
        return prismaClient.user.findMany({ select: { id: true, email: true } })
    }

    notify = async ({ message, title }: UserNotificationPayload) => {
        return await this.notifications.create({
            level: 'info',
            message,
            title,
            userId: this.userId
        })
    }

    notifyWithWarning = async ({ message, title }: UserNotificationPayload) => {
        return await this.notifications.create({
            level: 'warning',
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
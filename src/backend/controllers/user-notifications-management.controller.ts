import { inject, injectable } from "inversify";
import { ServiceTokens } from "../di-containers/tokens.di-container";
import { type UserNotificationsManagementServiceFactory } from "../di-containers/register-services";
import { ZodAPIController, zodApiMethod, ZodControllerSchemas } from "../utils/zod-api-controller____DEPRECATED.utils";
import { UserNotificationsManagementService } from "../services/user-notifications-management.service";
import z from "zod";
import { Notification } from "@/value-objects/notification.value-object";
import { ErrorFactory } from "@/value-objects/errors.value-object";

const errorFactory = ErrorFactory.forController('UserNotificationsManagement')

const schemas = {
    POST: {
        query: undefined,
        response: undefined,
        body: UserNotificationsManagementService.notificationPayloadSchema.extend({
            userId: z.string().nonempty(),
            level: Notification.levelSchema
        })
    }
} satisfies ZodControllerSchemas

@injectable()
export class UserNotificationsManagementController {
    public constructor(
        @inject(ServiceTokens.userNotificationsManagementFactory) private readonly serviceFactory: UserNotificationsManagementServiceFactory
    ) { }

    POST = zodApiMethod(schemas.POST, {
        handler: async ({ payload }) => {
            const service = this.serviceFactory(payload.userId)
            const errorGenerator = errorFactory.inMethod('POST')

            switch (payload.level) {
                case 'error':
                    return await service.notifyAboutError({ message: payload.message, title: payload.title })
                case 'info':
                    return await service.notify({ message: payload.message, title: payload.title })
                case 'warning':
                    return await service.notifyWithWarning({ message: payload.message, title: payload.title })
                default:
                    throw errorGenerator.newError({ error: 'Unsupported notification level', details: { level: payload.level }, statusCode: 500 })
            }
        }
    })
}

export type UserNotificationsManagementAPI = ZodAPIController<typeof schemas>
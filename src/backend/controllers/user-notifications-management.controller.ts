import { inject, injectable } from "inversify";
import { ServiceTokens } from "../di-containers/tokens.di-container";
import { type UserNotificationsManagementServiceFactory } from "../di-containers/register-services";
import { zodApiMethod, ZodController, ZodControllerSchemas } from "../utils/zod-api-controller.utils";
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
    },

    GET: {
        query: undefined,
        response: z.object({ items: z.array(Notification.modelSchema.extend({ userId: z.string().nonempty() })) }),
        body: undefined,
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
                    throw errorGenerator.newError({ error: 'Unsupported notification level', details: { level: payload.level } })
            }
        }
    })

    GET = zodApiMethod(schemas.GET, {
        handler: async ({ payload }) => {
            const service = this.serviceFactory(' ')
            const items = await service.all()

            return { items }
        }
    })
}

export type UserNotificationsManagementAPI = ZodController<typeof schemas, {
    Notification: z.infer<typeof schemas.GET['response']>['items'][number]
}>
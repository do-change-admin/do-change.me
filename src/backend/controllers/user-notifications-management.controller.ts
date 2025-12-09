import { inject, injectable } from 'inversify';
import z from 'zod';
import { ErrorFactory } from '@/value-objects/errors.value-object';
import { Notification } from '@/value-objects/notification.value-object';
import {
    type ZodController,
    type ZodControllerSchemas,
    zodApiMethod
} from '../DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';
import type { UserNotificationsManagementServiceFactory } from '../di-containers/register-services';
import { DIServices } from '../di-containers/tokens.di-container';
import { UserNotificationsManagementService } from '../services/user-notifications-management.service';

const errorFactory = ErrorFactory.forController('UserNotificationsManagement');

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
        body: undefined
    },

    AvailableUsers_GET: {
        query: undefined,
        response: z.object({
            data: z.array(
                z.object({
                    id: z.string(),
                    email: z.string(),
                    firstName: z.string().nullable(),
                    lastName: z.string().nullable()
                })
            )
        }),
        body: undefined
    }
} satisfies ZodControllerSchemas;

@injectable()
export class UserNotificationsManagementController {
    public constructor(
        @inject(DIServices.userNotificationsManagementFactory)
        private readonly serviceFactory: UserNotificationsManagementServiceFactory
    ) {}

    POST = zodApiMethod(schemas.POST, {
        handler: async ({ payload }) => {
            const service = this.serviceFactory(payload.userId);
            const errorGenerator = errorFactory.inMethod('POST');

            switch (payload.level) {
                case 'error':
                    return await service.notifyAboutError({ message: payload.message, title: payload.title });
                case 'info':
                    return await service.notify({ message: payload.message, title: payload.title });
                case 'warning':
                    return await service.notifyWithWarning({ message: payload.message, title: payload.title });
                default:
                    throw errorGenerator.newError({
                        error: 'Unsupported notification level',
                        details: { level: payload.level },
                        statusCode: 500
                    });
            }
        }
    });

    GET = zodApiMethod(schemas.GET, {
        handler: async () => {
            const service = this.serviceFactory(' ');
            const items = await service.all();

            return { items };
        }
    });

    AvaliableUsers_GET = zodApiMethod(schemas.AvailableUsers_GET, {
        handler: async () => {
            const service = this.serviceFactory(' ');
            const data = await service.availableUsers();

            return { data };
        }
    });
}

export type UserNotificationsManagementAPI = ZodController<
    typeof schemas,
    {
        Notification: z.infer<(typeof schemas.GET)['response']>['items'][number];
    }
>;

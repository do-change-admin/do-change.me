import { inject, injectable } from 'inversify';
import z from 'zod';
import {
    type ZodController,
    type ZodControllerSchemas,
    zodApiMethod
} from '../DEPRECATED-HELPERS/zod-api-controller.utils____DEPRECATED';
import type { UserNotificationsServiceFactory } from '../di-containers/register-services';
import { DIServices } from '../di-containers/tokens.di-container';
import { UserNotificationsService } from '../services/user-notifications.service';

const schemas = {
    GET: {
        response: z.object({
            items: z.array(UserNotificationsService.notificationDTO)
        }),
        body: undefined,
        query: undefined
    },
    Unseen_GET: {
        response: z.object({
            items: z.array(UserNotificationsService.notificationDTO)
        }),
        body: undefined,
        query: undefined
    },
    PATCH: {
        response: undefined,
        body: z.object({
            id: z.string().nonempty()
        }),
        query: undefined
    }
} satisfies ZodControllerSchemas;

@injectable()
export class UserNotificationsController {
    public constructor(
        @inject(DIServices.userNotificationsFactory) private readonly serviceFactory: UserNotificationsServiceFactory
    ) {}

    GET = zodApiMethod(schemas.GET, {
        handler: async ({ activeUser }) => {
            const service = this.serviceFactory(activeUser.id);
            const items = await service.all();
            return { items };
        }
    });

    PATCH = zodApiMethod(schemas.PATCH, {
        handler: async ({ activeUser, payload }) => {
            const service = this.serviceFactory(activeUser.id);
            await service.markAsRead(payload.id);
        }
    });
}

/**
 * PATCH - mark as read
 */
export type UserNotificationsAPI = ZodController<
    typeof schemas,
    {
        Notification: z.infer<typeof schemas.GET.response>['items'][number];
    }
>;

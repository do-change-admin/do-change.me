import { inject, injectable } from "inversify";
import { ZodAPIController, zodApiMethod, ZodControllerSchemas } from "../utils/zod-api-controller____DEPRECATED.utils";
import z from "zod";
import { UserNotificationsService } from "../services/user-notifications.service";
import { ServiceTokens } from "../di-containers/tokens.di-container";
import type { UserNotificationsServiceFactory } from "../di-containers/register-services";

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
} satisfies ZodControllerSchemas

@injectable()
export class UserNotificationsController {
    public constructor(
        @inject(ServiceTokens.userNotificationsFactory) private readonly serviceFactory: UserNotificationsServiceFactory
    ) { }

    GET = zodApiMethod(schemas.GET, {
        handler: async ({ activeUser }) => {
            const service = this.serviceFactory(activeUser.id)
            const items = await service.all()
            return { items }
        }
    })

    Unseen_GET = zodApiMethod(schemas.Unseen_GET, {
        handler: async ({ activeUser }) => {
            const service = this.serviceFactory(activeUser.id)
            const items = await service.allUnseen()
            return { items }
        }
    })

    PATCH = zodApiMethod(schemas.PATCH, {
        handler: async ({ activeUser, payload }) => {
            const service = this.serviceFactory(activeUser.id)
            await service.markAsRead(payload.id)
        }
    })
}

/**
 * PATCH - mark as read
 */
export type UserNotificationsAPI = ZodAPIController<typeof schemas>
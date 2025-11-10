import { FC, ReactNode } from "react";
import { UserNotificationDTO, userUserNotificationReading, useUserNotifications } from "./user-notifications.feature.api";
import { WithViews } from "@/client/utils/views.utils";
import { Loader, Warning } from "@/client/components/_ui";

export type UserNotificationsViews = {
    /**
     * Вёрстка уведомления у пользователя.
     */
    Item: FC<{
        /**
         * Модель уведомления.
         */
        data: Omit<UserNotificationDTO, 'seen' | 'id'> & {
            /**
             * Статус уведомления. Если оно уже прочитано - в этом объекте поле с флагом { seen: true }. 
             * В противном случае в этом объекте ещё есть функция для чтения уведомления и флаг, показывающий
             * идёт ли запрос на чтение после вызова этой функции.
             */
            status: { seen: false, read: Function, isPendingReadRequest: boolean } | { seen: true }
        }
    }>,

    /**
     * Layout списка уведомлений.
     */
    List: FC<{
        /**
         * Готовая вёрстка всех непрочитанных уведомлений.
         */
        unseenNotifications: ReactNode,
        /**
         * Готовая вёрстка всех прочитанных уведомлений.
         */
        seenNotifications: ReactNode
    }>
}

export type UserNotificationsContainerProps = WithViews<UserNotificationsViews>

export const UserNotificationsContainer: FC<UserNotificationsContainerProps> = ({ views, containerClass }) => {
    const { Item, List } = views

    const { data, isFetching } = useUserNotifications()
    const { mutate: readNotification, isPending } = userUserNotificationReading()

    if (isFetching) {
        return <div className={containerClass}>
            <Loader />
        </div>
    }

    if (!data?.items.length) {
        return <div className={containerClass}>
            <Warning message="You don't have any notifications for now" />
        </div>
    }

    const unseenNotificationItems = data?.items.filter(x => !x.seen) ?? []
    const seenNotificationItems = data?.items.filter(x => x.seen) ?? []

    return <div className={containerClass}>
        <List
            seenNotifications={seenNotificationItems.map((seenNotification) => {
                return <Item key={seenNotification.id} data={{
                    level: seenNotification.level,
                    message: seenNotification.message,
                    status: { seen: true },
                    title: seenNotification.title
                }} />
            })}

            unseenNotifications={unseenNotificationItems.map((unseenNotification) => {
                return <Item
                    key={unseenNotification.id}
                    data={{
                        level: unseenNotification.level,
                        message: unseenNotification.message,
                        status: {
                            seen: false,
                            isPendingReadRequest: isPending,
                            read: () => {
                                readNotification({ body: { id: unseenNotification.id } })
                            }
                        },
                        title: unseenNotification.title
                    }} />
            })}
        />
    </div>
}
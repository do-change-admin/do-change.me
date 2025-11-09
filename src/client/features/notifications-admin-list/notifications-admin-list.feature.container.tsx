import { FC, ReactNode } from "react";
import { AdminNotificationDTO, useNotificationsAdminList } from "./notifications-admin-list.feature.api";
import { WithViews } from "@/client/utils/views.utils";
import { Warning, Loader } from "@/client/components/_ui";

export type NotificationAdminListViews = {
    /**
     * Вёрстка уведомления в админском списке.
     */
    Item: FC<{
        /**
         * Модель админского уведомления.
         */
        data: AdminNotificationDTO
    }>,
    /**
     * Layout списка уведомлений.
     */
    List: FC<{
        /**
         * Готовая вёрстка уведомлений.
         */
        notificationsMarkup: ReactNode
    }>
}

export type NotificationAdminListContainerProps = WithViews<NotificationAdminListViews>

export const NotificationAdminListContainer: FC<NotificationAdminListContainerProps> = ({ views, containerClass }) => {
    const { Item, List } = views
    const { data, isFetching } = useNotificationsAdminList()

    if (isFetching) {
        return <div className={containerClass}>
            <Loader />
        </div>
    }

    if (!data?.items.length) {
        return <div className={containerClass}>
            <Warning message='No notifications was found' />
        </div>
    }

    return <div className={containerClass}>
        <List notificationsMarkup={data?.items?.map(x => {
            return <Item data={x} key={x.userId + x.title + x.level} />
        })} />
    </div>
}
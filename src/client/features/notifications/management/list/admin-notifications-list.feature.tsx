import type { FC, ReactNode } from 'react'
import { AdminNotificationDTO, useNotificationsAdminList } from './admin-notifications-list.feature.api'
import { QueryStatus } from '@tanstack/react-query'

export type AdminNotificationsListProps = {
    views: {
        /**
         * Вёрстка одного уведомления.
         */
        NotificationItem: FC<AdminNotificationDTO>,
        /**
         * Лэйаут фичи.
         */
        Layout: FC<{
            /**
             * Готовая вёрстка уведомлений.
             */
            notificationsMarkup: ReactNode,
            /**
             * Текущий статус запроса уведомлений.
             */
            status: QueryStatus,
            /**
             * Флаг, показывающий, что запрос данных закончился успешно, но данных не пришло.
             */
            noItems: boolean
        }>
    }
}

/**
 * Список уведомлений у всех пользователей, доступный администратору.
 */
export const AdminNotificationsList: FC<AdminNotificationsListProps> = ({
    views
}) => {
    const { Layout, NotificationItem } = views

    const { status, data } = useNotificationsAdminList()

    const noItems = status === 'success' && !data?.items?.length

    return <Layout 
        status={status} 
        noItems={noItems} 
        notificationsMarkup={
            data?.items?.map(({ level, message, seen, title, userId }) => {
                const key = `${userId}-${title}-${message}-${level}`
                return <NotificationItem 
                    level={level} 
                    message={message} 
                    seen={seen} 
                    title={title} 
                    userId={userId}
                    key={key} 
                />
            })
        } 
    />
}
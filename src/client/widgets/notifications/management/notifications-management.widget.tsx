'use client'

import type { FC } from 'react'
import { AddNotification, AdminNotificationsList } from '@/client/features/notifications/management'
import styles from './notifications-management.widget.module.css'
import { AddNotificationLayout, NotificationsListLayout, NotificationRow } from './views'

export type NotificationsManagementWidgetProps = {}

export const NotificationsManagementWidget: FC<NotificationsManagementWidgetProps> = () => {
    return <div className={styles.container}>
        <h3 style={{textAlign: 'center'}}>Notify user</h3>
        <AddNotification views={{
            Layout: AddNotificationLayout
        }} />
        <h3 style={{textAlign: 'center'}}>Notifications list</h3>
        <AdminNotificationsList views={{
            Layout: NotificationsListLayout,
            NotificationItem: NotificationRow
        }} />
    </div>
}
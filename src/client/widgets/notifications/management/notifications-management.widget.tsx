'use client'

import type { FC } from 'react'
import { AddNotification, AdminNotificationsList } from '@/client/features/notifications/management'
import styles from './notifications-management.widget.module.css'
import { AddNotificationLayout, NotificationsListLayout, NotificationRow } from './views'

export type NotificationsManagementWidgetProps = {}

export const NotificationsManagementWidget: FC<NotificationsManagementWidgetProps> = () => {
    return <div className={styles.container}>
        <h3 style={{textAlign: 'center'}}>Add notification</h3>
        <AddNotification views={{
            Layout: AddNotificationLayout
        }} />

        <h4 style={{textAlign: 'center'}}>All notifications list</h4>
        <AdminNotificationsList views={{
            Layout: NotificationsListLayout,
            NotificationItem: NotificationRow
        }} />
    </div>
}
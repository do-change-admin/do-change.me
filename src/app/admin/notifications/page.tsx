'use client'

import { NotificationsManagementWidget } from '@/client/widgets/notifications/management'
import styles from './page.module.css'

export default function Notifications() {
    return  <div className={styles.container}>
        <h2>Notifications management</h2>
        <NotificationsManagementWidget />
    </div>
}
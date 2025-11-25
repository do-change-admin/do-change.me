import { AdminNotificationsListProps } from "@/client/features/notifications/management";
import { Table } from "@mantine/core";
import cn from 'classnames'
import styles from './notification-row.module.css'

export const NotificationRow: AdminNotificationsListProps['views']['NotificationItem'] = ({
    level,
    message,
    seen,
    title,
    userId
}) => {
    return <Table.Tr className={cn({
        [styles.info]: level === 'info',
        [styles.warning]: level === 'warning',
        [styles.error]: level === 'error'
    })}>
        <Table.Td>{userId}</Table.Td>
        <Table.Td>{title}</Table.Td>
        <Table.Td>{message}</Table.Td>
        <Table.Td>{seen ? 'true' : 'false'}</Table.Td>
    </Table.Tr>
}
import { NotificationAdminListViews } from "../../notifications-admin-list.feature.container";
import cn from 'classnames'
import styles from './item.module.css'

export const Item: NotificationAdminListViews['Item'] = ({ data }) => {
    return <tr className={
        cn(
            [styles.container],
            {
                [styles.warning]: data.level === 'warning',
                [styles.error]: data.level === 'error',
                [styles.info]: data.level === 'info'
            })
    }>
        <td>{data.userId}</td>
        <td>{data.level}</td>
        <td>{data.message}</td>
    </tr>
}
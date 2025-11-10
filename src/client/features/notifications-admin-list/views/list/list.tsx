import { NotificationAdminListViews } from "../../notifications-admin-list.feature.container";
import styles from './list.module.css'

export const List: NotificationAdminListViews['List'] = ({
    notificationsMarkup
}) => {
    return <table className={styles.container}>
        <thead>
            <tr>
                <td>User ID</td>
                <td>Level</td>
                <td>Title</td>
                <td>Message</td>
            </tr>
        </thead>
        <tbody>
            {notificationsMarkup}
        </tbody>
    </table>
}
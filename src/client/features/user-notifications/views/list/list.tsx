import { UserNotificationsViews } from "../../user-notifications.feature.container";
import styles from './list.module.css'

export const List: UserNotificationsViews['List'] = ({
    seenNotifications,
    unseenNotifications
}) => {
    return <div className={styles.container}>
        <div>
            <h3>Unseen notifications</h3>
            {unseenNotifications}
        </div>
        <div>
            <h3>Seen notifications</h3>
            {seenNotifications}
        </div>
    </div>
}
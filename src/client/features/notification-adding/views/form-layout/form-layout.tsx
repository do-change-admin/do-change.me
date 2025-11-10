import { NotificationAddingViews } from "../../notification-adding.feature.container";
import styles from './form-layout.module.css'

export const FormLayout: NotificationAddingViews['FormLayout'] = ({
    addNotificationButton,
    levelSelect,
    messageInput,
    titleInput,
    userIdInput
}) => {
    return <div className={styles.container}>
        <div>UserID: {userIdInput}</div>
        <div>Title: {titleInput}</div>
        <div>Message: {messageInput}</div>
        <div>Level: {levelSelect}</div>
        <div>
            {addNotificationButton}
        </div>
    </div>
}
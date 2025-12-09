import { AddNotificationProps } from "@/client/features/notifications/management";
import styles from './add-notification-layout.module.css'

export const AddNotificationLayout: AddNotificationProps['views']['Layout'] = ({
    addNotificationButton,
    levelSelect,
    messageInput,
    titleInput,
    userSelect
}) => {
    return <div className={styles.container}>
        <div>User: {userSelect}</div>
        <div>Title: {titleInput}</div>
        <div>Message: {messageInput}</div>
        <div>Level: {levelSelect}</div>
        <div>{addNotificationButton}</div>
    </div>
}
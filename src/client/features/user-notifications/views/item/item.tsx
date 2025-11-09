import { Button } from "@mantine/core";
import { UserNotificationsViews } from "../../user-notifications.feature.container";
import styles from './item.module.css'
import classNames from "classnames";

export const Item: UserNotificationsViews['Item'] = ({ data }) => {
    const { level, message, status, title } = data

    const className = classNames({
        [styles.seenItem]: status.seen,
        [styles.unseenItem]: !status.seen,
        [styles.info]: level === 'info',
        [styles.warning]: level === 'warning',
        [styles.error]: level === 'error'
    })

    return <div className={className}>
        <div>
            {title}: {message}
        </div>
        {
            !status.seen ? <Button onClick={() => status.read()} disabled={status.isPendingReadRequest}>
                Read notification
            </Button> : <></>
        }
    </div>
}
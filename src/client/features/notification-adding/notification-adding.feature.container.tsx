import { FC, ReactNode, useState } from "react"
import { useNotificationAdding } from "./notification-adding.feature.api"
import type { NotificationLevel } from "@/value-objects/notification.value-object"
import { WithViews } from "@/client/utils/views.utils"
import { Select, Input, Button, Loader } from "@/client/components/_ui"

export type NotificationAddingViews = {
    FormLayout: FC<{
        userIdInput: ReactNode,
        titleInput: ReactNode,
        messageInput: ReactNode,
        levelSelect: ReactNode,
        addNotificationButton: ReactNode,
    }>
}

export type NotificationAddingContainerProps = WithViews<NotificationAddingViews>

export const NotificationAddingContainer: FC<NotificationAddingContainerProps> = ({
    views,
    containerClass
}) => {
    const { FormLayout } = views

    const [userId, setUserId] = useState('')
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [level, setLevel] = useState<NotificationLevel>('info')
    const { mutateAsync: addNotification, isPending } = useNotificationAdding()

    const messageInput = <Input value={message} onChange={(x) => { setMessage(x.target.value) }} />
    const titleInput = <Input value={title} onChange={(x) => { setTitle(x.target.value) }} />
    const userIdInput = <Input value={userId} onChange={(x) => { setUserId(x.target.value) }} />

    const levelSelect = <Select
        value={level}
        data={['error', 'info', 'warning'] as NotificationLevel[]}
        onChange={(x) => {
            if (!!x) {
                setLevel(x as NotificationLevel)
            }
        }}
    />

    const addNotificationButton = <Button
        disabled={!message || !title || !userId}
        onClick={async () => {
            try {
                await addNotification({
                    body: { level, message, title, userId }
                })
                alert("Notification was succesfully added")
            } catch (e) {
                console.log(e)
            }
        }}>Add notification</Button>


    if (isPending) {
        return <div className={containerClass}>
            <Loader />
        </div>
    }

    return <div className={containerClass}>
        <FormLayout
            levelSelect={levelSelect}
            messageInput={messageInput}
            titleInput={titleInput}
            userIdInput={userIdInput}
            addNotificationButton={addNotificationButton}
        />
    </div>
}
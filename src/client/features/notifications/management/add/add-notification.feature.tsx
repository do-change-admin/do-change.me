import type { NotificationLevel } from "@/value-objects/notification.value-object"
import { useState, type FC, type ReactNode } from "react"
import { Select, Input, Button } from "@/client/components/_ui"
import { useNotificationAdding } from "./add-notification.feature.api"
import { MutationStatus } from "@tanstack/react-query"

export type AddNotificationProps = {
    views: {
        Layout: FC<{
            status: MutationStatus,
            userIdInput: ReactNode,
            titleInput: ReactNode,
            messageInput: ReactNode,
            levelSelect: ReactNode,
            addNotificationButton: ReactNode,
        }>
    },
}

export const AddNotification: FC<AddNotificationProps> = ({ views }) => {
    const { Layout } = views

    const { mutate, status } = useNotificationAdding()

    const [userId, setUserId] = useState('')
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [level, setLevel] = useState<NotificationLevel>('info')

    const notEnoughDataToAddNotification = !message || !title || !userId
    const addNotification = () => {
        mutate({
            body: { level, message, title, userId },
        })
    }

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
        disabled={notEnoughDataToAddNotification}
        loading={status === 'pending'}
        onClick={() => addNotification()}
    >
        Add
    </Button>

    return <Layout 
        status={status} 
        addNotificationButton={addNotificationButton} 
        levelSelect={levelSelect}
        messageInput={messageInput}
        titleInput={titleInput}
        userIdInput={userIdInput}
    />
}
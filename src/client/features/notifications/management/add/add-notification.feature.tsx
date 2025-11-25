import type { NotificationLevel } from "@/value-objects/notification.value-object"
import { useState, type FC, type ReactNode } from "react"
import { Select, Input, Button } from "@/client/components/_ui"
import { useAvailableUsers, useNotificationAdding } from "./add-notification.feature.api"
import { MutationStatus } from "@tanstack/react-query"

export type AddNotificationProps = {
    views: {
        /**
         * Лэйаут фичи.
         */
        Layout: FC<{
            /**
             * Текущий статус добавления уведомления пользователю.
             */
            status: MutationStatus,
            /**
             * Селект с доступными пользователями.
             */
            userSelect: ReactNode,
            /**
             * Инпут с тайтлом уведоления.
             */
            titleInput: ReactNode,
            /**
             * Инпут с телом уведомления.
             */
            messageInput: ReactNode,
            /**
             * Селект с выбором уровня уведомления.
             */
            levelSelect: ReactNode,
            /**
             * Кнопка добавления уведомления.
             */
            addNotificationButton: ReactNode,
        }>
    },
}

/**
 * Точеченое добавление уведомления пользователю по его идентификатору.
 */
export const AddNotification: FC<AddNotificationProps> = ({ views }) => {
    const { Layout } = views

    const { mutate, status } = useNotificationAdding()
    const { data: users, isFetching } = useAvailableUsers()

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
    const userSelect = <Select
        value={userId}
        data={users?.data?.map(x => ({ label: x.email, value: x.id })) ?? []}
        onChange={(x) => { setUserId(x || "") }}
    />

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
        Add notification
    </Button>

    return <Layout 
        status={status} 
        addNotificationButton={addNotificationButton} 
        levelSelect={levelSelect}
        messageInput={messageInput}
        titleInput={titleInput}
        userSelect={userSelect}
    />
}
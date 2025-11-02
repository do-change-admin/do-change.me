import { SeparateView, View, WrapperView } from "@/client/utils/views.utils"
import { FC, ReactNode, useState } from "react"
import { useNotificationAdding } from "./notification-adding.feature.queries"
import { ReactState } from "@/client/utils/shared-types.utils"
import type { NotificationLevel } from "@/value-objects/notification.value-object"

export type NotificationAddingFeatureContainerProps = {
    views: {
        Container: WrapperView,
        UserSelector: View<{ userIdState: ReactState<string> }>,
        LevelSelector: View<{ levelState: ReactState<NotificationLevel> }>,
        TitleSelector: View<{ titleState: ReactState<string> }>,
        MessageSelector: View<{ messageState: ReactState<string> }>,
        AddNotificationButton: View<{ add: () => Promise<void>, disabled: boolean }>,
        Loader: SeparateView,
        FormLayout: View<{
            userSelector: ReactNode,
            titleControl: ReactNode,
            messageControl: ReactNode,
            levelSelector: ReactNode,
            addNotificationButton: ReactNode,
        }>
    },
}

export const NotificationAddingFeatureContainer: FC<NotificationAddingFeatureContainerProps> = ({
    views
}) => {
    const { Container, FormLayout, MessageSelector: MessageControl, TitleSelector: TitleControl, UserSelector, LevelSelector, Loader, AddNotificationButton } = views

    const userIdState = useState('')
    const titleState = useState('')
    const messageState = useState('')
    const levelState = useState<NotificationLevel>('info')
    const { mutateAsync: addNotification, isPending } = useNotificationAdding()

    const messageControl = <MessageControl messageState={messageState} />
    const levelSelector = <LevelSelector levelState={levelState} />
    const titleControl = <TitleControl titleState={titleState} />
    const userSelector = <UserSelector userIdState={userIdState} />
    const addNotificationButton = <AddNotificationButton
        add={async () => {
            await addNotification({
                body: {
                    level: levelState[0],
                    message: messageState[0],
                    title: titleState[0],
                    userId: userIdState[0]
                }
            })
        }}
        disabled={!messageState[0] || !titleState[0] || !userIdState[0]}
    />


    if (isPending) {
        return <Container>
            <Loader />
        </Container>
    }

    return <FormLayout
        messageControl={messageControl}
        titleControl={titleControl}
        userSelector={userSelector}
        levelSelector={levelSelector}
        addNotificationButton={addNotificationButton}
    />
}
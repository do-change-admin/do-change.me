'use client'

import { injectViews } from "@/client/utils/views.utils";
import { NotificationAddingFeatureContainer } from "./notification-adding.feature.container";
import { Button, Input, Select } from "@mantine/core";
import { NotificationLevel } from "@/value-objects/notification.value-object";

export const NotificationAddingFeature = injectViews(NotificationAddingFeatureContainer, {
    AddNotificationButton: ({ add, disabled }) => {
        return <Button disabled={disabled} onClick={async () => {
            try {
                await add()
                alert("Notification was succesfully added")
            } catch (e) {
                console.log(e)
            }
        }}>Add notification</Button>
    },

    Container: ({ children }) => {
        return <>{children}</>
    },

    FormLayout: ({ addNotificationButton, levelSelector, messageControl, titleControl, userSelector }) => {
        return <div>
            <div>UserID: {userSelector}</div>
            <div>Title: {titleControl}</div>
            <div>Message: {messageControl}</div>
            <div>Level: {levelSelector}</div>
            <div>
                {addNotificationButton}
            </div>
        </div>
    },

    Loader: () => <div>Loading...</div>,

    LevelSelector: ({ levelState }) => {
        return <Select value={levelState[0]} data={['error', 'info', 'warning'] as NotificationLevel[]} onChange={(x) => {
            if (!!x) {
                levelState[1](x as NotificationLevel)
            }
        }} />
    },

    MessageSelector: ({ messageState }) => {
        return <Input value={messageState[0]} onChange={(x) => { messageState[1](x.target.value) }} />
    },

    TitleSelector: ({ titleState }) => {
        return <Input value={titleState[0]} onChange={(x) => { titleState[1](x.target.value) }} />
    },

    UserSelector: ({ userIdState }) => {
        return <Input value={userIdState[0]} onChange={(x) => { userIdState[1](x.target.value) }} />
    },
})
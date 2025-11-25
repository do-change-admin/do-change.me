import { useUnreadNotificationsCount, UserNotificationsList, UserNotificationDetails } from '@/client/features/notifications/user'
import { ActionIcon, Drawer, Indicator } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import type { FC } from 'react'
import { FaBell } from 'react-icons/fa6'
import { NotificationsLayout, NotificationListItem, NotificationDetails } from './views'

export type UserListWidgetProps = {}

/**
 * Список уведомлений текущего пользователя.
 */
export const UserListWidget: FC<UserListWidgetProps> = () => {
    const { count, isFetching } = useUnreadNotificationsCount();
    const [opened, { open, close }] = useDisclosure(false);
    
    return <> 
        <Indicator 
            inline 
            size={16} 
            offset={7}
            position="top-end" 
            color={!isFetching && !count ? "lightblue" : "red"} 
            withBorder 
            processing={isFetching}  
            label={isFetching ? undefined : count}
        >
            <ActionIcon
                variant="light"
                color="blue"
                radius="xl"
                size="xl"
                onClick={open}
            >
                <FaBell size={22}/>
            </ActionIcon>
        </Indicator>
        <Drawer 
            zIndex={9999999999999999} 
            position="right" 
            offset={8} 
            radius="lg"
            opened={opened} 
            onClose={close}
            title="Your notifications"
        >
            <UserNotificationsList views={{
                Layout: NotificationsLayout,
                NotificationItem: NotificationListItem
            }} />
        </Drawer>
        <UserNotificationDetails views={{
            NotificationDetails
        }} />
    </>

}
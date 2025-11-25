import type { FC, ReactNode } from 'react'
import { useUserNotifications } from './user-notifications-list.feature.api'
import { QueryStatus } from '@tanstack/react-query'
import { UserNotificationDTO } from '../notifications.user.feature.shared-models'
import { useSetAtom } from 'jotai'
import { currentSelectedDetailsItemAtom } from '../notifications.user.feature.state'

export type UserNotificationsListProps = {
    views: {
        NotificationItem: FC<Omit<UserNotificationDTO, 'id'> & {  selectForDetailView: Function }>,
        Layout: FC<{
            notificationsMarkup: ReactNode,
            fetchingStatus: QueryStatus,
            noItems: boolean,
        }>
    }
}

export const UserNotificationsList: FC<UserNotificationsListProps> = ({
    views
}) => {
    const { Layout, NotificationItem } = views

    const { data, status } = useUserNotifications()
    const setSelectedDetails = useSetAtom(currentSelectedDetailsItemAtom)

    const noItems = status === 'success' && !data?.items?.length
    
    return <Layout 
        fetchingStatus={status}
        noItems={noItems}
        notificationsMarkup={
            data?.items?.map((item) => {
                return <NotificationItem 
                    key={item.id} 
                    level={item.level} 
                    message={item.message} 
                    seen={item.seen}
                    title={item.title}
                    selectForDetailView={() => {
                        setSelectedDetails(item)
                    }}
                />
            })
        }
    />
}
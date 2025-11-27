import type { FC } from 'react'
import { UserNotificationDTO } from '../notifications.user.feature.shared-models'
import { useAtom } from 'jotai'
import { currentSelectedDetailsItemAtom } from '../notifications.user.feature.state'
import { MutationStatus } from '@tanstack/react-query'
import { useUserNotificationReading } from './user-notification-details.feature.api'

export type UserNotificationDetailsProps = {
    views: {
        /**
         * Вёрстка детального вида уведомления.
         */
        NotificationDetails: FC<{
            currentItem: Omit<UserNotificationDTO, 'seen' | 'id'>,
            clearSelectedItem: Function,
            seen: { status: true } | { status: false, read: Function, mutationStatus: MutationStatus }
        }>,
        /**
         * Вёрстка, которая будет показываться, если никакого уведомления не выбрано для детального просмотра.
         */
        NoSelectedItemDetails?: FC
    }
}

/**
 * Детальная информация по выбранному пользователем в списке уведомлении.
 */
export const UserNotificationDetails: FC<UserNotificationDetailsProps> = ({
    views
}) => {
    const { NoSelectedItemDetails, NotificationDetails } = views

    const [currentDetails, setCurrentDetails] = useAtom(currentSelectedDetailsItemAtom)
    const { mutate, status } = useUserNotificationReading()

    const clearSelectedItem = () => {
        setCurrentDetails(undefined)
    }

    if (!currentDetails) {
        return NoSelectedItemDetails ? <NoSelectedItemDetails /> : undefined
    }

    return <NotificationDetails 
        clearSelectedItem={clearSelectedItem}
        currentItem={currentDetails}
        seen={
            currentDetails?.seen 
                ? { 
                    status: true 
                } 
                : { 
                    status: false, 
                    mutationStatus: status, 
                    read: () => { mutate({ body: { id: currentDetails!.id } }) } 
                }
            } 
    />
}
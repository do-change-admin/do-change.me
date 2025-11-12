import {FC, PropsWithChildren, ReactNode, useState} from "react";
import { UserNotificationDTO, userUserNotificationReading, useUserNotifications } from "./user-notifications.feature.api";
import { WithViews } from "@/client/utils/views.utils";
import { Loader, Warning } from "@/client/components";
import {Alert, Modal} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";

export type UserNotificationsViews = {
    /**
     * Вёрстка уведомления у пользователя.
     */
    Item: FC<{
        /**
         * Модель уведомления.
         */
        data: Omit<UserNotificationDTO, 'seen' | 'id'> & {
            /**
             * Статус уведомления. Если оно уже прочитано - в этом объекте поле с флагом { seen: true }.
             * В противном случае в этом объекте ещё есть функция для чтения уведомления и флаг, показывающий
             * идёт ли запрос на чтение после вызова этой функции.
             */
            status: { seen: boolean, open: Function }
        }
    }>,

    /**
     * Layout списка уведомлений.
     */
    List: FC<PropsWithChildren>
}

export type UserNotificationsContainerProps = WithViews<UserNotificationsViews>

export const UserNotificationsContainer: FC<UserNotificationsContainerProps> = ({ views, containerClass }) => {
    const { Item, List } = views

    const { data, isFetching } = useUserNotifications()
    const {mutateAsync: readNotification, isPending } = userUserNotificationReading()
    const [opened, { open, close }] = useDisclosure(false);
    const [currentNotification,  setCurrentNotification] = useState<UserNotificationDTO>();

    if (isFetching) {
        return <div className={containerClass}>
            <Loader />
        </div>
    }

    if (!data?.items.length) {
        return <div className={containerClass}>
            <Alert radius="lg" c="gray" title="You don't have any notifications for now" />
        </div>
    }

    return <div className={containerClass}>
        <List>
            <Modal zIndex={9999999999999999} opened={opened && Boolean(currentNotification)} onClose={ async () => {
                if (!currentNotification?.seen) {
                    await readNotification({body: {id: currentNotification?.id || ''}})
                }
                setCurrentNotification(undefined)
                close()
            }}>
                {currentNotification?.message}
            </Modal>
            {data.items.map(item => {
                return <Item key={item.id} data={{
                    level: item.level,
                    message: item.message,
                    status: {
                        open: () => {
                            setCurrentNotification(item)
                            open()
                        },
                        seen: item.seen
                    },
                    title: item.title
                }} />
            })}
        </List>
    </div>
}
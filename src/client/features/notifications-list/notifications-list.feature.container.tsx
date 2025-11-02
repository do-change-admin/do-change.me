import { FC, memo, ReactNode, useMemo } from "react";
import { userUserNotificationReading, useUserNotifications } from "./notifications-list.feature.queries";
import type { NotificationLevel } from "@/value-objects/notification.value-object";
import type { SeparateView, View, WrapperView } from "@/client/utils/views.utils";

export type NotificationsListFeatureContainerProps = {
    views: {
        Container: WrapperView,
        Loader: SeparateView,
        NoItems: SeparateView,
        NotificationsWrapper: View<{ unseenNotifications: ReactNode, seenNotifications: ReactNode }>,
        UnseenNotification: View<{ title: string, message: string, level: NotificationLevel, read: () => void }>,
        SeenNotification: View<{ title: string, message: string, level: NotificationLevel }>
    }
}

export const NotificationsListFeatureContainer: FC<NotificationsListFeatureContainerProps> = ({ views }) => {
    const { Container, Loader, NoItems, NotificationsWrapper, SeenNotification, UnseenNotification } = views

    const MemoizedSeenNotification = memo(SeenNotification)
    const MemoizedUnseenNotification = memo(UnseenNotification)

    const { data, isFetching } = useUserNotifications()
    const { mutate: readNotification } = userUserNotificationReading()

    const unseenNotificationItems = data?.items.filter(x => !x.seen) ?? []
    const cachedUnseenNotifications = useMemo(() => unseenNotificationItems.map((x) => {
        return <MemoizedUnseenNotification
            key={x.id}
            message={x.message}
            read={() => { readNotification({ body: { id: x.id } }) }}
            title={x.title}
            level={x.level}
        />
    }), [unseenNotificationItems.map(x => x.id).join(',')])

    const seenNotificationItems = data?.items.filter(x => x.seen) ?? []
    const cachedSeenNotifications = useMemo(() => seenNotificationItems.map((x) => {
        return <MemoizedSeenNotification
            key={x.id}
            message={x.message}
            title={x.title}
            level={x.level}
        />
    }), [seenNotificationItems.map(x => x.id).join(',')])

    if (isFetching) {
        return <Container>
            <Loader />
        </Container>
    }

    if (!data?.items.length) {
        return <Container>
            <NoItems />
        </Container>
    }

    return <Container>
        <NotificationsWrapper
            seenNotifications={cachedSeenNotifications}
            unseenNotifications={cachedUnseenNotifications}
        />
    </Container>
}
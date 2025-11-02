import { FeatureViews } from "@/client/utils/views.utils";
import { NotificationsListFeatureContainer } from "./notifications-list.feature.container";

export const notificationListFeatureViews: FeatureViews<typeof NotificationsListFeatureContainer> = {
    Container: ({ children }) => <>{children}</>,

    Loader: () => <div>loading...</div>,

    NoItems: () => <div>no items were found</div>,

    NotificationsWrapper: ({ seenNotifications, unseenNotifications }) => <>
        {unseenNotifications}
        {seenNotifications}
    </>,

    SeenNotification: ({ level, message, title }) => <div>
        {title} - {message} ({level})
    </div>,

    UnseenNotification: ({ level, message, read, title }) => <div>
        <div>
            {title} - {message} ({level})
        </div>
        <button onClick={() => { read() }}>Read</button>
    </div>
}
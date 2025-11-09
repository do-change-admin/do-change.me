import { injectViews } from "@/client/utils/views.utils";
import { NotificationAdminListContainer } from "./notifications-admin-list.feature.container";
import { Item, List } from "./views";

export const NotificationsAdminList = injectViews(NotificationAdminListContainer, { Item, List })

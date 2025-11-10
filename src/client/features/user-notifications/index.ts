'use client'

import { Item, List } from './views'
import { injectViews } from "@/client/utils/views.utils";
import { UserNotificationsContainer } from "./user-notifications.feature.container";

export const UserNotifications = injectViews(UserNotificationsContainer, { Item, List })
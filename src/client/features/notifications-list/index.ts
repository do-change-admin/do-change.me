'use client'

import { injectViews } from "@/client/utils/views.utils";
import { NotificationsListFeatureContainer } from "./notifications-list.feature.container";
import { notificationListFeatureViews } from "./notifications-list.feature.views";

export const NotificationsListFeature = injectViews(NotificationsListFeatureContainer, notificationListFeatureViews)
'use client'

import { injectViews } from "@/client/utils/views.utils";
import { NotificationAddingFeatureContainer } from "./notification-adding.feature.container";
import { notificationAddingFeatureViews } from "./notification-adding.feature.views";

export const NotificationAddingFeature = injectViews(NotificationAddingFeatureContainer, notificationAddingFeatureViews)